// Trang danh kết quả đăng ký thi
class ExamRegisterResult extends BaseGrid {

    // Hàm khởi tạo grid
    constructor(gridId, toolbarId, pagingId) {
        super(gridId, toolbarId, pagingId);

        this.pageDetail = null;
        this.formImport = null;
    }
    
    // Tạo page detail
    createPageDetail(gridId, toolbarId, pagingId){
        this.pageDetail = new ExamRegisterResultDetail(gridId, toolbarId, pagingId);
        this.pageDetail.pageMaster = this;
        this.pageDetail.createFormImport("#importStudents");
    }

    // Tạo thêm mới form nhập khẩu
    createFormImport(idForm){
        this.formImport = new ImportForm(this, idForm);
    }
    
    // Xuất khẩu danh sách
    export(){
        this.formImport.exportData();
    }

    //Hàm load dữ liệu
    loadAjaxData(){
        let me = this,
            paramPaging = me.getParamPaging(),
            semesterId = parseInt(localStorage.getItem("SemesterId")),
            url = mappingApi.ExamRegisterResult.urlGetData.format(semesterId),
            urlFull = url + Constant.urlPaging.format(paramPaging.Size, paramPaging.Page);

        if(url && semesterId){
            $(".grid-wrapper").addClass("loading");

            CommonFn.GetAjax(urlFull, function (response) {
                if(response.status == Enum.StatusResponse.Success){
                    me.loadData(response.data["ExamResponses"]);
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
            entityName: "ExamRegisterResult",
            formTitle:"Kết quả đăng ký thi"
        };

        return object;
    }

    // Hàm dùng đối với từng loại toolbar đặc thù
    customToolbarItem(commandName){
        let me = this;

        switch(commandName){
            case "ViewDetail":
                me.viewDetail();
        }
    }

    // Khi bấm vào xem chi tiết
    viewDetail(){
        let me = this,
            masterData = me.getSelection()[0];

        $("[Layout='Master']").hide();
        $("[Layout='Detail']").show();
        
        me.pageDetail.show(masterData);
    }

    // Custom dữ liệu trước khi binding
    prepareBeforeRender(data){
        let me = this;

        data = data.filter(function(item){
            item.NumberOfStudent = item.NumberOfStudentSubscribe + "/" + item.NumberOfStudent;
            return item;
        });

        return data
    }
}

    // Khởi tạo trang
var examRegisterResult = new ExamRegisterResult("#GridExamRegisterResult", "#ToolbarGridExamRegisterResult", "#paging-GridExamRegisterResult");
    // Tạo trang chi tiết bên trong
    examRegisterResult.createPageDetail("#StudentSubjectDetail", "#ToolbarStudentSubjectDetail", "#paging-StudentSubjectDetail");
    // Xuất khẩu dữ liệu
    examRegisterResult.createFormImport("#formExport");


    // Khởi tạo form thay đổi mật khẩu
var changePasswordForm = new ChangePasswordForm(null, "#formChangePassword", 500, 233, null);





