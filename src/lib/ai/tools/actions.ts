import { IDLKnowledgeService } from '../knowledge/IDLKnowledgeService';

export const AIWebsiteTools = {
  /**
   * Search courses based on class or subject
   */
  searchCourses: async (classId?: string, subject?: string) => {
    return await IDLKnowledgeService.getCourseKnowledge(classId, subject);
  },

  /**
   * Get teacher details
   */
  getTeachers: async (subject?: string) => {
    return await IDLKnowledgeService.getTeacherKnowledge(subject);
  },

  /**
   * Get admission info
   */
  getAdmissionInfo: async () => {
    return await IDLKnowledgeService.getAdmissionKnowledge();
  },

  /**
   * Get center details
   */
  getCenters: async () => {
    return await IDLKnowledgeService.getCenterKnowledge();
  },
  
  /**
   * Define suggested UI actions (navigation) based on intent
   */
  getSuggestedActions: (intent: 'courses' | 'teachers' | 'admission' | 'centers') => {
    switch(intent) {
      case 'courses':
        return [{ label: 'View All Courses', type: 'navigation', href: '/school' }];
      case 'teachers':
        return [{ label: 'View Expert Teachers', type: 'navigation', href: '/#teachers' }];
      case 'admission':
        return [{ label: 'Apply for Admission', type: 'navigation', href: '/admission' }];
      default:
        return [];
    }
  }
};
