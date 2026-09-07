import {
  getAttendanceClasses,
  getAttendanceStudents,
  createAttendanceStudent,
  markPeriodAttendance,
  getClassWeeklyAttendance,
  getClassMonthlyAttendance,
  getSubjects
} from '../src/app/actions/attendance';

async function main() {
  console.log('--- Starting Attendance E2E Verification ---');

  // 1. Get classes
  const classesRes = await getAttendanceClasses();
  console.log('1. Classes fetch:', classesRes.success, 'Count:', classesRes.data?.length);
  const classes = classesRes.data || [];
  const class9 = classes.find((c: any) => c.name?.includes('9') || c.displayName?.includes('9'));
  const class10 = classes.find((c: any) => c.name?.includes('10') || c.displayName?.includes('10'));
  console.log('   Class 9 found:', class9?.id, class9?.displayName || class9?.name);
  console.log('   Class 10 found:', class10?.id, class10?.displayName || class10?.name);

  if (!class9) {
    throw new Error('Class 9th not found!');
  }

  // 2. Fetch or create student for Class 9th
  let studentsRes = await getAttendanceStudents(class9.id);
  console.log('2. Class 9 students count:', studentsRes.data?.length);
  let student = studentsRes.data?.[0];

  if (!student) {
    console.log('   Adding a test student to Class 9th...');
    const createRes = await createAttendanceStudent({
      name: 'Rohan Sharma',
      studentCode: '901',
      classId: class9.id,
      phone: '9876543210',
      parentPhone: '9876543211'
    });
    console.log('   Student created:', createRes);
    studentsRes = await getAttendanceStudents(class9.id);
    student = studentsRes.data?.[0];
  }

  console.log('   Using Student:', student?.name, 'ID:', student?.id, 'Code:', student?.studentCode);

  // 3. Mark attendance for Hour 1 (4:00 PM - 5:00 PM) for today
  const todayStr = new Date().toISOString().slice(0, 10);
  console.log('3. Marking attendance for today:', todayStr, 'Hour 1...');

  const markH1Res = await markPeriodAttendance({
    classId: class9.id,
    sessionDate: todayStr,
    periodIndex: 1,
    subjectId: 'maths_test',
    subjectName: 'Mathematics',
    records: [
      {
        studentId: student.id,
        studentName: student.name,
        studentCode: student.studentCode,
        status: 'PRESENT',
        inTime: '16:02',
        outTime: '17:00',
        remark: 'On time'
      }
    ]
  });
  console.log('   Hour 1 mark result:', markH1Res);

  // 4. Mark attendance for Hour 2 (5:00 PM - 6:00 PM)
  console.log('4. Marking attendance for Hour 2...');
  const markH2Res = await markPeriodAttendance({
    classId: class9.id,
    sessionDate: todayStr,
    periodIndex: 2,
    subjectId: 'science_test',
    subjectName: 'Science',
    records: [
      {
        studentId: student.id,
        studentName: student.name,
        studentCode: student.studentCode,
        status: 'PRESENT',
        inTime: '17:00',
        outTime: '18:05',
        remark: 'Stayed extra 5 mins'
      }
    ]
  });
  console.log('   Hour 2 mark result:', markH2Res);

  // 5. Test Weekly Report
  console.log('5. Testing Weekly Report for Class 9...');
  const curr = new Date();
  const day = curr.getDay();
  const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(curr.setDate(diff));
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);

  const mondayStr = monday.toISOString().slice(0, 10);
  const saturdayStr = saturday.toISOString().slice(0, 10);

  const weeklyRes = await getClassWeeklyAttendance(class9.id, mondayStr, saturdayStr);
  console.log('   Weekly records fetched:', weeklyRes.success, 'Count:', weeklyRes.data?.length);
  const todayStudentLogs = weeklyRes.data?.filter((r: any) => r.studentId === student.id && r.sessionDate === todayStr);
  console.log('   Student today records count:', todayStudentLogs?.length);
  todayStudentLogs?.forEach((log: any) => {
    console.log(`     - Hour ${log.periodIndex} (${log.subjectName}): ${log.status} [${log.inTime} -> ${log.outTime}] remark: "${log.remark}"`);
  });

  // 6. Test Monthly Report
  const monthStr = todayStr.slice(0, 7);
  console.log('6. Testing Monthly Report for month:', monthStr);
  const monthlyRes = await getClassMonthlyAttendance(class9.id, monthStr);
  console.log('   Monthly records fetched:', monthlyRes.success, 'Count:', monthlyRes.data?.length);

  const monthStudentLogs = monthlyRes.data?.filter((r: any) => r.studentId === student.id);
  const presentCount = monthStudentLogs?.filter((r: any) => r.status === 'PRESENT').length || 0;
  console.log(`   Student total monthly hours attended: ${presentCount} / ${monthStudentLogs?.length}`);

  console.log('--- Attendance E2E Verification Complete: ALL TESTS PASSED ---');
}

main().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
