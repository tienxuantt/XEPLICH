// Trang danh sách sinh viên chi tiết
class StudentSubject extends BaseGrid {

    // Hàm khởi tạo grid
    constructor(gridId, toolbarId, pagingId) {
        super(gridId, toolbarId, pagingId);

        this.pageMaster = null;
        this.masterData = null;
        this.formImport = null;
    }
    
    // Tạo form detail
    createFormDetail(formID, width, height){
        this.formDetail = new StudentSubjectForm(this, formID, width, height, this.config.formTitle);
    }

    // Tạo thêm mới form nhập khẩu
    createFormImport(idForm){
        this.formImport = new ImportForm(this, idForm);
    }

    //override: Thiết lập các config
    getConfig() {
        let object = {
            role: "Admin",
            entityName: "StudentSubjects",
            formTitle:"Sinh viên"
        };

        return object;
    }

    //Hàm load dữ liệu
    loadAjaxData(){
        let me = this;

        if(me.masterData){
            let entityName = me.config.entityName,
                url = mappingApi[entityName].urlGetData,
                paramPaging = me.getParamPaging(),
                urlFull = url.format(me.masterData.Id) + Constant.urlPaging.format(paramPaging.Size, paramPaging.Page);
    
            if(url){
                $(".grid-wrapper").addClass("loading");

                CommonFn.GetAjax(urlFull, function (response) {
                    if(response.status == Enum.StatusResponse.Success){
                        me.loadData(response.data["StudentSubjects"]);
                        me.resetDisplayPaging(response.data.Page);
                        me.editMode = Enum.EditMode.View;
                        $(".grid-wrapper").removeClass("loading");
                    }
                });
            }
        }
    }

    // Hiển thị khi từ màn hình cha truyền vào
    show(){
        let me = this;

        me.configTitlePage();
        me.loadAjaxData();
    }

    // Thiết lập tiêu đề cho trang
    configTitlePage(){
        let me = this,
            masterData = me.masterData,
            subjectName = masterData.SubjectName,
            subjectCode = masterData.SubjectCode,
            titlePage = 'Danh sách sinh viên - ' + subjectName + ' (' + subjectCode + ')';

        $(".header-title[Layout='Detail']").text(titlePage.toLocaleUpperCase());
    }

    // Hàm dùng đối với từng loại toolbar đặc thù
    customToolbarItem(commandName){
        let me = this;

        switch(commandName){
            case "Back":
                me.back();
                break;
            case "Accept":
                me.accept();
                break;
            case "Reject":
                me.reject();
                break;
        }
    }

    // Khi bấm vào xem chi tiết
    back(){
        let me = this;

        $("[Layout='Master']").show();
        $("[Layout='Detail']").hide();

        me.masterData = null;
        me.pageMaster.loadAjaxData();
    }

    // Hàm dùng để cho phép thi
    accept(){
        let me = this;

        me.changeStatus(1);
    }

    // Hàm dùng để cấm thi
    reject(){
        let me = this;

        me.changeStatus(2);
    }

    // Thay đổi trạng thái sinh viên
    changeStatus(status){
        let me = this,
            record = me.getSelection()[0],
            entityName = me.config.entityName,
            url = mappingApi[entityName].urlReject,
            data = {
                Id: record.Id,
                Status: status
            };

        if(url){
            CommonFn.PostPutAjax("PUT", url, data, function(response) {
                if(response.status == Enum.StatusResponse.Success){
                    me.loadAjaxData();
                }
            });
        }
    }

    // Nhập khẩu danh sách
    import(){
        this.formImport.show();
    }

    // Xuất khẩu danh sách
    export(){
        this.formImport.exportData();
    }

    // Custom các button bị disable
    getCustomToolbarDisable(listItemDisable){
        let me = this,
            records = me.getSelection();

        if(records.length == 1 && records[0].Status == 1){
            listItemDisable.push("Accept");
        }else if(records.length == 1 && records[0].Status == 2){
            listItemDisable.push("Reject");
        }else{
            listItemDisable.push("Accept");
            listItemDisable.push("Reject");
        }

        return listItemDisable;
    }
}





