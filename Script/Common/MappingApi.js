// Các api map với chương trình

var mappingApi = {
    Students:{ // Sinh viên
        urlGetData: "http://admin.dkt.vnu.edu.vn:8881/admin/student/all",                   
        urlCreate: "http://admin.dkt.vnu.edu.vn:8881/admin/student",                        
        urlUpdate: "http://admin.dkt.vnu.edu.vn:8881/admin/student",                        
        urlDelete: "http://admin.dkt.vnu.edu.vn:8881/admin/student/list",                   
        urlCheckDuplicate: "http://admin.dkt.vnu.edu.vn:8881/admin/student/check_exist",    
        urlGetDataSearch: "http://admin.dkt.vnu.edu.vn:8881/admin/student/find",            
        urlDownloadFileTemplate: "http://admin.dkt.vnu.edu.vn:8881/admin/student/template", 
        urlUploadFile: "http://admin.dkt.vnu.edu.vn:8881/admin/student/import",             
        urlExport: "http://admin.dkt.vnu.edu.vn:8881/admin/student/export"                  
    },

    Master:{
        urlLogin: "http://admin.dkt.vnu.edu.vn:8881/admin/auth/login",                      
        urlChangePassword: "http://admin.dkt.vnu.edu.vn:8881/admin/auth/change_password",
    },

    Subjects:{ // Học phần
        urlGetData: "http://admin.dkt.vnu.edu.vn:8881/admin/subject/all",                   
        urlCreate: "http://admin.dkt.vnu.edu.vn:8881/admin/subject",                        
        urlUpdate: "http://admin.dkt.vnu.edu.vn:8881/admin/subject",                        
        urlDelete: "http://admin.dkt.vnu.edu.vn:8881/admin/subject/list",                   
        urlCheckDuplicate: "http://admin.dkt.vnu.edu.vn:8881/admin/subject/check_exist",    
        urlGetDataSearch: "http://admin.dkt.vnu.edu.vn:8881/admin/subject/find",            
        urlGetDataNotInSemester: "http://admin.dkt.vnu.edu.vn:8881/admin/subject_not_in_semester/{0}", 
        urlDownloadFileTemplate: "http://admin.dkt.vnu.edu.vn:8881/admin/subject/template", 
        urlUploadFile: "http://admin.dkt.vnu.edu.vn:8881/admin/subject/import",             
        urlExport: "http://admin.dkt.vnu.edu.vn:8881/admin/subject/export"                  
    },

    Rooms:{ // Phòng thi
        urlGetData: "http://admin.dkt.vnu.edu.vn:8881/admin/room/all",                      
        urlCreate: "http://admin.dkt.vnu.edu.vn:8881/admin/room",                           
        urlUpdate: "http://admin.dkt.vnu.edu.vn:8881/admin/room",                           
        urlDelete: "http://admin.dkt.vnu.edu.vn:8881/admin/room/list",                      
        urlCheckDuplicate: "http://admin.dkt.vnu.edu.vn:8881/admin/room/check_exist" ,      
        urlGetDataSearch: "http://admin.dkt.vnu.edu.vn:8881/admin/room/find",               
        urlGetDataNotInSemester: "http://admin.dkt.vnu.edu.vn:8881/admin/room_not_in_semester/{0}", 
        urlDownloadFileTemplate: "http://admin.dkt.vnu.edu.vn:8881/admin/room/template",     
        urlUploadFile: "http://admin.dkt.vnu.edu.vn:8881/admin/room/import",             
        urlExport: "http://admin.dkt.vnu.edu.vn:8881/admin/room/export"                  
    },

    Semesters:{ // Kì thi
        urlGetData: "http://admin.dkt.vnu.edu.vn:8881/admin/semester/all",                  
        urlCreate: "http://admin.dkt.vnu.edu.vn:8881/admin/semester",                       
        urlUpdate: "http://admin.dkt.vnu.edu.vn:8881/admin/semester",                       
        urlDelete: "http://admin.dkt.vnu.edu.vn:8881/admin/semester/list",                  
        urlCheckDuplicate: "http://admin.dkt.vnu.edu.vn:8881/admin/semester/check_exist",   
        urlGetDataSearch: "http://admin.dkt.vnu.edu.vn:8881/admin/semester/find",           
        urlStartRegister: "http://admin.dkt.vnu.edu.vn:8881/admin/semester/{0}/active",     
        urlDoneRegister: "http://admin.dkt.vnu.edu.vn:8881/admin/semester/{0}/done"        
    },

    SubjectSemesters:{ // Danh sách học phần - Sinh viên
        urlGetData: "http://admin.dkt.vnu.edu.vn:8881/admin/subject_semesters/semester/{0}",  
        urlCreate: "http://admin.dkt.vnu.edu.vn:8881/admin/subject_semesters/list",           
        urlDelete: "http://admin.dkt.vnu.edu.vn:8881/admin/subject_semesters/list",           
    },

    StudentSubjects: { // Danh sách sinh viên trong học phần
        urlGetData: "http://admin.dkt.vnu.edu.vn:8881/admin/student_subject/student_in_subject/{0}",
        urlCreate: "http://admin.dkt.vnu.edu.vn:8881/admin/student_subject/add_one",        
        urlDelete: "http://admin.dkt.vnu.edu.vn:8881/admin/student_subject/list",           
        urlCheckExistItem: "http://admin.dkt.vnu.edu.vn:8881/admin/student_subject/check_create", 
        urlReject: "http://admin.dkt.vnu.edu.vn:8881/admin/student_subject/status",         
        urlDownloadFileTemplate: "http://admin.dkt.vnu.edu.vn:8881/admin/student_subject/template",      
        urlUploadFile: "http://admin.dkt.vnu.edu.vn:8881/admin/student_subject/import/subject_semester/{0}",      
        urlExport: "http://admin.dkt.vnu.edu.vn:8881/admin/student_subject/export/subject_semester/{0}"       
    },

    RoomSetting:{ // Thiết lập phòng thi
        urlGetData: "http://admin.dkt.vnu.edu.vn:8881/admin/room_semesters/semester/{0}", 
        urlCreate: "http://admin.dkt.vnu.edu.vn:8881/admin/room_semesters/list", 
        urlUpdate: "http://admin.dkt.vnu.edu.vn:8881/admin/room_semesters/list", 
        urlDelete: "http://admin.dkt.vnu.edu.vn:8881/admin/room_semesters/list", 
        urlExport: "http://admin.dkt.vnu.edu.vn:8881/admin/room_semesters/export/semester/{0}"
    },

    CreateExams:{ // Tạo lịch thi
        urlGetData: "http://admin.dkt.vnu.edu.vn:8881/admin/exam/semester/{0}", 
        urlCreate: "http://admin.dkt.vnu.edu.vn:8881/admin/exam/list/semester/{0}", 
        urlUpdate: "http://admin.dkt.vnu.edu.vn:8881/admin/exam",
        urlDelete: "http://admin.dkt.vnu.edu.vn:8881/admin/exam/list", 
        urlExport: "http://admin.dkt.vnu.edu.vn:8881/admin/exam/export/semester/{0}", 
        urlGetConflic: "http://admin.dkt.vnu.edu.vn:8881/admin/subject_semesters/subject_conflict/semester/{0}"
    },

    ExamRegisterResult:{ // Kết quả đăng ký thi
        urlGetData: "http://admin.dkt.vnu.edu.vn:8881/admin/exam/semester/{0}", 
        urlExport: "http://admin.dkt.vnu.edu.vn:8881/admin/exam/result_export/semester/{0}" 
    },

    ExamRegisterResultDetail: { // Lấy danh sách xem chi tiết
        urlGetData: "http://admin.dkt.vnu.edu.vn:8881/admin/student_subject_exam/subject_semester/{0}", 
        urlExport: "http://admin.dkt.vnu.edu.vn:8881/admin/student_subject_exam/export/subject_semester/{0}"
    }
}