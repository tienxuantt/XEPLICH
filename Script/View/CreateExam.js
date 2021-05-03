// Trang tạo lịch thi
class CreateExamPage extends BaseGrid {

    // Hàm khởi tạo grid
    constructor(gridId, toolbarId, pagingId) {
        super(gridId, toolbarId, pagingId);

        this.editMode = Enum.EditMode.View;
        this.formImport = null;

        this.setStatusToolbar();
    }

    //override: Thiết lập các config
    getConfig() {
        let object = {
            role: "Admin",
            entityName: "CreateExams",
            formTitle:"Lịch thi"
        };

        return object;
    }
    
    // Tạo page detail
    createPageDetail(){
        this.pageDetail = new CreateExamDetail(this);
    }

    // Tạo thêm mới form nhập khẩu
    createFormImport(idForm){
        this.formImport = new ImportForm(this, idForm);
    }
    
    // Xuất khẩu danh sách
    export(){
        this.formImport.exportData();
    }
    
    // Hàm dùng đối với từng loại toolbar đặc thù
    customToolbarItem(commandName){
        let me = this;

        switch(commandName){
            case "CreateAgain":
                me.createAgain();
                break;
            case "Back":
                me.back();
                break;
            case "SettingTime":
                me.settingTime();
                break;
        }
    }

    // Thiết lập thời gian
    settingTime(){
        $(".settingTime").toggleClass("display-none");
    }

    // Hàm quay lại màn  hình chính
    back(){
        let me = this;

        $("[Layout='Master']").show();
        $("[Layout='Detail']").hide();
        me.editMode = Enum.EditMode.View;
        me.setStatusToolbar();
        me.pageDetail.resetData();
        
        me.loadAjaxData();
    }

    // Khi bấm vào xem chi tiết
    createAgain(){
        let me = this;

        $("[Layout='Master']").hide();
        $("[Layout='Detail']").show();
        me.editMode = Enum.EditMode.Edit;
        me.setStatusToolbar();
        
        me.pageDetail.show();
    }

    // Xử lý cất
    save(){
        let me = this;

        me.pageDetail.save();
    }

    // Thiết lập nếu không có bản ghi nào chọn thì disable sửa, xóa
    setStatusToolbar(){
        let me = this,
            listToolbarVisible = me.getbarItemVisible();

        $("[CommanName]").each(function(){
            let commanName = $(this).attr("CommanName");

            if(listToolbarVisible.includes(commanName)){
                $(this).show();
            }else{
                $(this).hide();
            }
        });
    }

    // Lấy các toolbar bị ẩn
    getbarItemVisible(){
        let me = this,
            listToolbarVisible = [];

        if(me.editMode == Enum.EditMode.View){
            listToolbarVisible = ["CreateAgain", "Delete", "Export"];
        }else{
            listToolbarVisible = ["Back", "Save","SettingTime"];
        }

        return listToolbarVisible;
    }

    //Hàm load dữ liệu
    loadAjaxData(){
        let me = this,
            paramPaging = me.getParamPaging(),
            semesterId = parseInt(localStorage.getItem("SemesterId")),
            url = mappingApi.CreateExams.urlGetData.format(semesterId),
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
}

    // Khởi tạo trang quản lý Phòng thi
var createExamPage = new CreateExamPage("#GridCreateExam", "#ToolbarGridCreateExam", "#paging-GridCreateExam");
    // Tạo trang detail
    createExamPage.createPageDetail();
    // Tạo form xuất khẩu
    createExamPage.createFormImport("#formExport");


    // Khởi tạo form thay đổi mật khẩu
var changePasswordForm = new ChangePasswordForm(null, "#formChangePassword", 500, 233, null);





