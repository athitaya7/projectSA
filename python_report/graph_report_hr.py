import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import mysql.connector
import io, base64
from jinja2 import Template
from datetime import datetime

# ---------- เชื่อมต่อฐานข้อมูล ----------
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="hrms"
)

# ---------- ดึงข้อมูลหลัก ----------
df_emp = pd.read_sql("SELECT * FROM employees", conn)
df_pay = pd.read_sql("SELECT * FROM payroll", conn)
df_perf = pd.read_sql("SELECT * FROM performance_reviews", conn)
conn.close()

# ---------- วิเคราะห์ข้อมูล ----------
# 1) พนักงานแต่ละแผนก
dept_counts = df_emp['department'].value_counts()

# 2) สัดส่วนเพศ
gender_counts = df_emp['gender'].value_counts()

# 3) เงินเดือนเฉลี่ยต่อแผนก
avg_salary = df_pay.merge(df_emp[['employee_code','department']], on='employee_code')
avg_salary = avg_salary.groupby('department')['total_salary'].mean().sort_values(ascending=False)

# 4) ประสบการณ์เฉลี่ย (จาก work_info ใน DB)
# (ถ้าต้องการใช้จริง ให้ query จาก work_info)
# สมมติเราคำนวณจาก hire_date
df_emp['years_exp'] = (pd.Timestamp.now() - pd.to_datetime(df_emp['hire_date'])).dt.days / 365
exp_avg = df_emp.groupby('department')['years_exp'].mean().round(1)

# 5) คะแนนประเมินเฉลี่ยต่อแผนก
df_perf = df_perf.merge(df_emp[['employee_code','department']], on='employee_code')
perf_avg = df_perf.groupby('department')['score'].mean().sort_values(ascending=False)

# 6) ยอดรวมรายได้ต่อแผนก
total_pay = avg_salary * dept_counts  # (โดยประมาณ)

# ---------- สร้างกราฟ ----------
sns.set(style="whitegrid", font="Tahoma")

def plot_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.getvalue()).decode("utf-8")

# กราฟ 1: พนักงานต่อแผนก
fig1, ax1 = plt.subplots(figsize=(8,4))
dept_counts.plot(kind='bar', ax=ax1, color='skyblue')
ax1.set_title("จำนวนพนักงานแต่ละแผนก")
ax1.set_ylabel("คน")
img1 = plot_to_base64(fig1)

# กราฟ 2: สัดส่วนเพศ
fig2, ax2 = plt.subplots(figsize=(4,4))
ax2.pie(gender_counts, labels=gender_counts.index, autopct="%.1f%%", colors=sns.color_palette("pastel"))
ax2.set_title("สัดส่วนเพศพนักงาน")
img2 = plot_to_base64(fig2)

# กราฟ 3: เงินเดือนเฉลี่ยต่อแผนก
fig3, ax3 = plt.subplots(figsize=(8,4))
avg_salary.plot(kind='barh', ax=ax3, color='lightgreen')
ax3.set_title("เงินเดือนเฉลี่ยต่อแผนก (บาท)")
img3 = plot_to_base64(fig3)

# กราฟ 4: คะแนนประเมินผลงาน
fig4, ax4 = plt.subplots(figsize=(8,4))
perf_avg.plot(kind='barh', ax=ax4, color='salmon')
ax4.set_title("คะแนนประเมินผลงานเฉลี่ยต่อแผนก")
img4 = plot_to_base64(fig4)

# ---------- สร้างรายงาน HTML ----------
html_template = """
<html>
<head>
<meta charset="utf-8">
<title>HR Analytics Dashboard</title>
<style>
body { font-family: Tahoma, sans-serif; margin: 30px; color: #222; }
h1 { color: #1565c0; }
img { max-width: 100%; border: 1px solid #eee; margin-bottom: 30px; }
section { margin-bottom: 40px; }
</style>
</head>
<body>
<h1>HR Analytics Dashboard</h1>
<p>สร้างเมื่อ: {{ date }}</p>

<section>
<h2>👩‍💼 จำนวนพนักงานแต่ละแผนก</h2>
<img src="data:image/png;base64,{{ img1 }}">
</section>

<section>
<h2>⚖️ สัดส่วนเพศพนักงาน</h2>
<img src="data:image/png;base64,{{ img2 }}">
</section>

<section>
<h2>💸 เงินเดือนเฉลี่ยต่อแผนก</h2>
<img src="data:image/png;base64,{{ img3 }}">
</section>

<section>
<h2>⭐ คะแนนประเมินเฉลี่ยต่อแผนก</h2>
<img src="data:image/png;base64,{{ img4 }}">
</section>

<footer>
<p>รายงานอัตโนมัติจากฐานข้อมูล HRMS</p>
</footer>
</body>
</html>
"""

tpl = Template(html_template)
html = tpl.render(
    date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    img1=img1, img2=img2, img3=img3, img4=img4
)

with open("hr_report.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ สร้างรายงานเสร็จแล้ว: hr_report.html")
