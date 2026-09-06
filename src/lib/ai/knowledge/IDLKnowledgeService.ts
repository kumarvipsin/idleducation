import { getExpertTeachers } from '@/app/actions/data';
import { getFreeCourses } from '@/app/actions/free-courses';
import { getPaidCourses } from '@/app/actions/paid-courses';

export class IDLKnowledgeService {
  /**
   * Fetch courses information.
   * To keep context small, we return summarized versions of the courses.
   */
  static async getCourseKnowledge(classId?: string, subject?: string) {
    const freeRes = await getFreeCourses();
    const paidRes = await getPaidCourses();
    
    let freeCourses = freeRes.success && freeRes.data ? freeRes.data : [];
    let paidCourses = paidRes.success && paidRes.data ? paidRes.data : [];

    // Filter by class or subject if provided
    if (classId) {
      freeCourses = freeCourses.filter((c: any) => c.class.toLowerCase().includes(classId.toLowerCase()));
      paidCourses = paidCourses.filter((c: any) => c.class.toLowerCase().includes(classId.toLowerCase()));
    }
    
    if (subject) {
      freeCourses = freeCourses.filter((c: any) => c.subject.toLowerCase().includes(subject.toLowerCase()));
      paidCourses = paidCourses.filter((c: any) => c.subject.toLowerCase().includes(subject.toLowerCase()));
    }

    // Map to a simpler structure to save tokens
    const mapCourse = (c: any) => ({
      title: c.title,
      class: c.class,
      board: c.board,
      subject: c.subject,
      price: c.price,
      validity: c.validity,
      status: c.status,
      chaptersCount: c.chapters?.length || 0,
      description: c.description
    });

    return {
      freeCourses: freeCourses.map(mapCourse),
      paidCourses: paidCourses.map(mapCourse)
    };
  }

  /**
   * Fetch teachers information
   */
  static async getTeacherKnowledge(subject?: string) {
    const res = await getExpertTeachers();
    let teachers = res.success && res.data ? res.data : [];

    if (subject) {
      teachers = teachers.filter((t: any) => t.subject.toLowerCase().includes(subject.toLowerCase()));
    }

    return teachers.map((t: any) => ({
      name: t.name,
      designation: t.designation,
      subject: t.subject,
      examFocus: t.examFocus,
      experience: t.experience,
      qualification: t.qualification,
      teachingFocus: t.teachingFocus,
      shortBio: t.shortBio
    }));
  }

  /**
   * Get admission info (Static structure if dynamic isn't needed, or fetch if available)
   */
  static async getAdmissionKnowledge() {
    return {
      rules: "Admissions are open for CBSE, ICSE, JEE, NEET. Register online or visit center.",
      actionLink: "/admission"
    };
  }

  /**
   * Fetch center addresses (Currently mock/static as per common setup unless a model exists)
   */
  static async getCenterKnowledge() {
    return [
      {
        name: "Mukherjee Nagar Center",
        location: "Mukherjee Nagar, Delhi",
        type: "Main Branch"
      }
    ];
  }
}
