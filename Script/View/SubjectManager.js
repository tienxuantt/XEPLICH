// Trang quản lý Học phần
class SubjectManagerPage extends BaseGrid {

    // Hàm khởi tạo grid
    constructor(gridId, toolbarId, pagingId) {
        super(gridId, toolbarId, pagingId);

        this.formImport = null;
    }
    
    // Tạo form detail
    createFormDetail(formID, width, height){
        this.formDetail = new SubjectManagerForm(this, formID, width, height, this.config.formTitle);
    }
    
    // Tạo thêm mới form nhập khẩu
    createFormImport(idForm){
        this.formImport = new ImportForm(this, idForm);
    }

    // Nhập khẩu danh sách
    import(){
        this.formImport.show();
    }
    
    // Xuất khẩu danh sách
    export(){
        this.formImport.exportData();
    }

    //override: Thiết lập các config
    getConfig() {
        let object = {
            role: "Admin",
            entityName: "Subjects",
            formTitle:"Học phần"
        };

        return object;
    }
}

    // Khởi tạo trang quản lý Học phần
var subjectManagerPage = new SubjectManagerPage("#GridSubject", "#ToolbarGridSubject", "#paging-GridSubject");
    // Tạo một form detail
    subjectManagerPage.createFormDetail("#formSubjectDetail", 500, 185);
    // Tạo một form nhập khẩu
    subjectManagerPage.createFormImport("#formImportSubject");
    // Load dữ liệu cho grid ( sau này sẽ bỏ đi để dùng ajax)
    subjectManagerPage.loadAjaxData();


    // Khởi tạo form thay đổi mật khẩu
var changePasswordForm = new ChangePasswordForm(null, "#formChangePassword", 500, 233, null);
   




