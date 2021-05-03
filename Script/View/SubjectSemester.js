// Trang danh sách học phần - sinh viên
class SubjectSemester extends BaseGrid {

    // Hàm khởi tạo grid
    constructor(gridId, toolbarId, pagingId) {
        super(gridId, toolbarId, pagingId);

        this.pageDetail = null;
    }
    
    // Tạo form detail
    createFormDetail(formId, gridId, toolbarId, width, height){
        this.formDetail = new ChooseSubjectForm(formId, gridId, toolbarId, this, width, height);
    }

    // Tạo page detail
    createPageDetail(gridId, toolbarId, pagingId){
        this.pageDetail = new StudentSubject(gridId, toolbarId, pagingId);
        this.pageDetail.createFormDetail("#formStudentSubject", 400, 133);
        this.pageDetail.createFormImport("#formImportStudent");
        this.pageDetail.pageMaster = this;
    }

    //Hàm load dữ liệu
    loadAjaxData(){
        let me = this,
            paramPaging = me.getParamPaging(),
            semesterId = parseInt(localStorage.getItem("SemesterId")),
            url = mappingApi.SubjectSemesters.urlGetData.format(semesterId),
            urlFull = url + Constant.urlPaging.format(paramPaging.Size, paramPaging.Page);

        if(url && semesterId){
            $(".grid-wrapper").addClass("loading");

            CommonFn.GetAjax(urlFull, function (response) {
                if(response.status == Enum.StatusResponse.Success){
                    me.loadData(response.data["SubjectSemesters"]);
                    me.resetDisplayPaging(response.data.Page);
                    me.editMode = Enum.EditMode.View;
                    $(".grid-wrapper").removeClass("loading");
                }
            });
        }
    }

    // Khởi tạo một số sự kiện
    initEventElement(){
        super.initEventElement();
        let me = this;

        $("#chooseExam").on('selectmenuchange', function(){
            let  semesterId = parseInt($(this).val());

            localStorage.setItem("SemesterId", semesterId);
            me.loadAjaxData();
        });
    }

    //override: Thiết lập các config
    getConfig() {
        let object = {
            role: "Admin",
            entityName: "SubjectSemesters",
            formTitle:"Danh sách học phần"
        };

        return object;
    }

    // Hàm dùng đối với từng loại toolbar đặc thù
    customToolbarItem(commandName){
        let me = this;

        switch(commandName){
            case "Choose":
                me.choose();
                break;
            case "ViewDetail":
                me.viewDetail();
        }
    }

    // Chọn danh sách học phần
    choose(){
        let me = this;

        me.formDetail.show();
    }

    // Khi bấm vào xem chi tiết
    viewDetail(){
        let me = this,
            masterData = me.getSelection()[0];

        $("[Layout='Master']").hide();
        $("[Layout='Detail']").show();
        
        me.pageDetail.masterData = masterData;
        me.pageDetail.show();
    }
}

    // Khởi tạo trang quản lý Học phần
var subjectSemester = new SubjectSemester("#GridListSubject", "#ToolbarGridListSubject", "#paging-GridListSubject");
    // Tạo một form detail
    subjectSemester.createFormDetail("#formSubject","#GridSubject", "#ToolbarChooseSubject", 800, 500);
    // Tạo trang chi tiết bên trong
    subjectSemester.createPageDetail("#StudentSubject", "#ToolbarStudentSubject", "#paging-StudentSubject");


    // Khởi tạo form thay đổi mật khẩu
var changePasswordForm = new ChangePasswordForm(null, "#formChangePassword", 500, 233, null);





