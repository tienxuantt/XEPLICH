// Trang danh sách sinh viên chi tiết - kết quả đăng ký thi
class ExamRegisterResultDetail extends BaseGrid {

    // Hàm khởi tạo grid
    constructor(gridId, toolbarId, pagingId) {
        super(gridId, toolbarId, pagingId);

        this.pageMaster = null;
        this.masterId = null;
        this.masterData = {};
        this.formImport = null;
    }
    
    //override: Thiết lập các config
    getConfig() {
        let object = {
            role: "Admin",
            entityName: "ExamRegisterResultDetail",
            formTitle:"Sinh viên"
        };

        return object;
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
    loadAjaxData(masterData){
        let me = this,
            masterId = masterData ? masterData.SubjectSemesterId : me.masterId,
            paramPaging = me.getParamPaging(),
            url = mappingApi.ExamRegisterResultDetail.urlGetData.format(masterId),
            urlFull = url + Constant.urlPaging.format(paramPaging.Size, paramPaging.Page);

        // Gán masterId lưu lại dùng 
        me.masterId = masterData ? masterData.Id : me.masterId;
        me.masterData.Id = me.masterId;

        if(url && masterId){
            $(".grid-wrapper").addClass("loading");

            CommonFn.GetAjax(urlFull, function (response) {
                if(response.status == Enum.StatusResponse.Success){
                    me.loadData(response.data["StudentSubjectExams"]);
                    me.resetDisplayPaging(response.data.Page);
                    me.editMode = Enum.EditMode.View;
                    $(".grid-wrapper").removeClass("loading");
                }
            });
        }
    }

    // Hiển thị khi từ màn hình cha truyền vào
    show(masterData){
        let me = this;

        me.configTitlePage(masterData);

        me.loadAjaxData(masterData);
    }

    // Thiết lập tiêu đề cho trang
    configTitlePage(masterData){
        let me = this,
            subjectName = masterData.SubjectName,
            subjectCode = masterData.SubjectCode,
            roomName = masterData.RoomName,
            titlePage = 'Danh sách sinh viên - ' + roomName + ' : ' + subjectName + ' (' + subjectCode + ')';

        $(".header-title[Layout='Detail']").text(titlePage.toLocaleUpperCase());
    }

    // Hàm dùng đối với từng loại toolbar đặc thù
    customToolbarItem(commandName){
        let me = this;

        switch(commandName){
            case "Back":
                me.back();
                break;
        }
    }

    // Khi bấm vào xem chi tiết
    back(){
        let me = this;

        $("[Layout='Master']").show();
        $("[Layout='Detail']").hide();
        
        me.pageMaster.loadAjaxData();
    }
}





