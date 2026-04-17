export default function StudentInfoTab({ student }: any) {
    return (
      <div>
        <h3>פרטים אישיים</h3>
  
        <p>כתובת: {student.address}</p>
        <p>אמא: {student.mother_name}</p>
        <p>טלפון אמא: {student.mother_phone}</p>
        <p>אבא: {student.father_name}</p>
        <p>טלפון אבא: {student.father_phone}</p>
      </div>
    );
  }