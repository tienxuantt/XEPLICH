class BaseDetail extends Grid{
    // Hàm khởi tạo grid
    constructor(formId, gridId, toolbarId, jsCaller, width, height){
        super(gridId, toolbarId);

        this.form = $(formId);
        this.jsCaller = jsCaller;
        this.config = this.getConfig();

        this.setSizeForm(width, height);
        this.initEvent();
    }

    // Khởi tạo các sự kiện
    initEvent(){
        super.initEvent();
        let me = this;

        me.form.draggable();

        me.form.find(".btn-save").off("click");
        me.form.find(".btn-cancel").off("click");
        
        me.form.find(".btn-save").on("click",me.save.bind(this));
        me.form.find(".btn-cancel").on("click",me.close.bind(this));
    }

    // Cất dữ liệu
    save(){
        let me = this,
            data = me.getSubmitData();

        me.saveChangeData(data); 

        me.close();
    }

    // Lấy dữ liệu để cất
    getSubmitData(){
        let me = this,
            records = me.getSelection();

        records = me.cusomDataBeforeSave(records);

        return records;
    }

    // Custom dữ liệu trước khi cất
    cusomDataBeforeSave(records){
        return records;
    }

    // Lưu dữ liệu vào DB
    saveChangeData(data){
        let me = this,
            entityName = me.jsCaller.config.entityName;
            
        if(data){
            CommonFn.PostPutAjax("POST", mappingApi[entityName].urlCreate, data, function(response) {
                if(response.status == Enum.StatusResponse.Success){
                    me.showMessageSuccess();
                    me.jsCaller.loadAjaxData();
                }
            });
        }
    }

    // Hàm hiển thị form
    show(){
        let me = this;

        me.form.parent().show();
        me.loadAjaxData(); 
    }

    // Đóng form
    close(){
        $(".wrapper-form").hide();
    }

    // Hiển thị thông báo cất thành công
    showMessageSuccess(customMessage){
        let message = customMessage || "Cất dữ liệu thành công!";

        $("#success-alert strong").text(message);

        $("#success-alert").fadeTo(1500, 500).slideUp(500, function(){
            $("#success-alert").slideUp(500);
        });
    }

    // Thiết lập chiều rộng, chiều cao form
    setSizeForm(width, height){
        this.form.width(width);
        this.form.height(height);
    }

    // Hàm load dữ liệu
    loadAjaxData(){
         let me = this,
            entityName = me.config.entityName,
            semesterId = parseInt(localStorage.getItem("SemesterId")),
            url = mappingApi[entityName].urlGetDataNotInSemester.format(semesterId),
            urlFull = url + Constant.urlPaging.format(1000, 1);

        if(url && entityName){
            CommonFn.GetAjax(urlFull, function (response) {
                if(response.status == Enum.StatusResponse.Success){
                    me.loadData(response.data[entityName]);
                    me.editMode = Enum.EditMode.View;
                }
            });
        }
    }

    // Đổ dữ liệu vào grid
    loadData(data){
        super.loadData(data);
    }

    // Lấy các button bị disable
    getDisableToolbarItem(){
        let me = this,
            records = me.getSelection(),
            listItemDisable = [];

        if(records.length == 0){
            listItemDisable.push("ChooseSave");
        }

        return listItemDisable;
    }

    getConfig(){return null;}
}