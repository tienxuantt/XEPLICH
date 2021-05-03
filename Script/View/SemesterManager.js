// Trang quản lý kì thi
class SemesterManagerPage extends BaseGrid {

    // Hàm khởi tạo grid
    constructor(gridId, toolbarId, pagingId) {
        super(gridId, toolbarId, pagingId);

        this.initOtherEvent();
    }

    // Khởi tạo một số sự kiện khác
    initOtherEvent(){
        
        // Thêm datetimepicker
        $(".datetimepicker").datetimepicker({
            format:'d/m/Y H:i',
            defaultTime:'07:00',
            step:30,
            timeFormat: 'HH:mm'
        });
    }
    
    // Tạo form detail
    createFormDetail(formID, width, height){
        this.formDetail = new SemesterManagerForm(this, formID, width, height, this.config.formTitle);
    }

    //override: Thiết lập các config
    getConfig() {
        let object = {
            role: "Admin",
            entityName: "Semesters",
            formTitle:"Kì thi"
        };

        return object;
    }

    // Custom các button bị disable
    getCustomToolbarDisable(listItemDisable){
        let me = this,
            records = me.getSelection();

        if(records.length == 1 && records[0].Status == 1){
            listItemDisable.push("DoneRegister");
        }else if(records.length == 1 && records[0].Status == 2){
            listItemDisable.push("StartRegister");
        }else{
            listItemDisable.push("DoneRegister");
            listItemDisable.push("StartRegister");
        }

        return listItemDisable;
    }

    // Hàm dùng đối với từng loại toolbar đặc thù
    customToolbarItem(commandName){
        let me = this;

        switch(commandName){
            case "StartRegister":
                me.startRegister();
                break;
            case "DoneRegister":
                me.doneRegister();
        }
    }

    // Hàm bắt đầu đăng ký
    startRegister(){
        let me = this,
            record = me.getSelection()[0],
            urlFull = mappingApi.Semesters.urlStartRegister.format(record.Id);
            
        if(record.Id){
            CommonFn.PostPutAjax("PUT", urlFull, null, function(response) {
                if(response.status == Enum.StatusResponse.Success){
                    me.showMessageSuccess("Thiết lập thành công!");
                    me.loadAjaxData();
                }else{
                    me.showMessageError("Không thể đăng ký hai kì thi một thời điểm!");
                }
            });
        }
    }

    // Hàm kết thúc đăng ký
    doneRegister(){
        let me = this,
        record = me.getSelection()[0],
        urlFull = mappingApi.Semesters.urlDoneRegister.format(record.Id);

        if(record.Id){
            CommonFn.PostPutAjax("PUT", urlFull, null, function(response) {
                if(response.status == Enum.StatusResponse.Success){
                    me.showMessageSuccess("Thiết lập thành công!");
                    me.loadAjaxData();
                }
            });
        }
    }
}

    // Khởi tạo trang quản lý Kì thi
var semesterManagerPage = new SemesterManagerPage("#GridSemester", "#ToolbarGridSemester", "#paging-GridSemester");
    // Tạo một form detail
    semesterManagerPage.createFormDetail("#formSemester", 500, 235);
    // Load dữ liệu cho grid 
    semesterManagerPage.loadAjaxData();


    // Khởi tạo form thay đổi mật khẩu
var changePasswordForm = new ChangePasswordForm(null, "#formChangePassword", 500, 233, null);





