// Trang quản lý sinh viên
class StudentManagerPage extends BaseGrid {

    // Hàm khởi tạo grid
    constructor(gridId, toolbarId, pagingId) {
        super(gridId, toolbarId, pagingId);

        this.formImport = null;
    }
    
    // Tạo form detail
    createFormDetail(formID, width, height){
        this.formDetail = new StudentManagerForm(this, formID, width, height, this.config.formTitle);
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
            entityName: "Students",
            formTitle:"Sinh viên"
        };

        return object;
    }
}

    // Khởi tạo trang quản lý sinh viên
var studentManagerPage = new StudentManagerPage("#GridStudent", "#ToolbarGridStudent", "#paging-GridStudent");
    // Tạo một form detail
    studentManagerPage.createFormDetail("#formStudent", 500, 235);
    // Tạo một form nhập khẩu
    studentManagerPage.createFormImport("#formImportStudent");
    // Load dữ liệu cho grid 
    studentManagerPage.loadAjaxData();


    // Khởi tạo form thay đổi mật khẩu
var changePasswordForm = new ChangePasswordForm(null, "#formChangePassword", 500, 233, null);
   




