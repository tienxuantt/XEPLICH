// Form thêm, sửa, xóa
class BaseForm{
    // Hàm khởi tạo
    constructor(jsCaller, idForm, width, height, title){
        this.form = $(idForm);
        this.title = title;
       
        this.jsCaller = jsCaller;
        this.setSizeForm(width, height);
        this.initEvent();
    }

    // Khởi tạo các sự kiện
    initEvent(){
        this.form.draggable();

        this.form.find(".btn-save").off("click");
        this.form.find(".btn-cancel").off("click");
        
        this.form.find(".btn-save").on("click",this.save.bind(this));
        this.form.find(".btn-cancel").on("click",this.close.bind(this));
        this.form.find("input").blur(this.checkStatusInput); 
        this.form.find("input").keyup(this.checkStatusInput); 

        // Thêm datepicker cho ô input chọn ngày tháng
        $(".datepicker").datepicker({ 
                dateFormat: 'dd/mm/yy',
                onSelect: function(date) {
                    $(this).parent().removeClass("error-validate");
                }
        });
    }

    // Kiểm tra xem đã đúng validate chưa
    checkStatusInput(){
        let value = $(this).val(),
            require = $(this).attr("Require"),
            dataType = $(this).attr("DataType");

        if(value.trim() == "" && require){
            $(this).parent().addClass("error-validate");
            $(this).attr("title", "Dữ liệu không được để trống!");

            if(dataType == "Number"){
                $(this).val("");
            }
        }else{
            $(this).parent().removeClass("error-validate");
        }
    }
    
    // Cất dữ liệu
    save(){
        let me = this,
            isValid = me.validateForm();

        if(isValid){
            let data = me.submitData();
                data = me.mappingData(data, me.jsCaller.recordCache);
                data = me.customData(data);

            me.saveChangeData(data); 
            me.close();
        }
    }

    // Validate trước khi save
    validateForm(){
        let me = this,
            isValid = me.validateFormRequire(); // Validate các trường require

            if(isValid){
                isValid = me.validateFieldDate(); // Validate ô ngày tháng
            }

            if(isValid){
                isValid = me.validateFieldNumber(); // Validate ô nhập số
            }

            if(isValid){
                isValid = me.validateCustom(); // Validate tùy màn hình khác
            }

            if(isValid){
                isValid = me.validateCheckDuplicate(); // Validate check trùng
            }

        return isValid;
    }

    // Validate form trước khi lưu
    validateFormRequire(){
        let isValid = true;

        this.form.find("input[Require], select[Require]").each(function(){
            let value = $(this).val(),
                comboName = $(this).attr("ComboboxName");

            if(comboName){
                value = $(this).parent().find(".ui-selectmenu-text").text();
            }

            if(value.trim() == ""){
                $(this).parent().addClass("error-validate");
                $(this).attr("title", "Dữ liệu không được để trống!");
                isValid = false;
            }else{
                $(this).parent().removeClass("error-validate");
            }
        });

        return isValid;
    }

    // Validate các ô ngày tháng
    validateFieldDate(){
        let isValid = true;

        this.form.find("input[DataType='Date']").each(function(){
            let value = $(this).val(),
                patt = new RegExp("[0-9]{2}/[0-9]{2}/[0-9]{4}");

            if(value && !patt.test(value)){
                $(this).parent().addClass("error-validate");
                $(this).attr("title", "Cần nhập đúng định dạng ngày tháng dd/MM/yyyy");
                isValid = false;
            }else{
                $(this).parent().removeClass("error-validate");
            }
        });

        return isValid;
    }

    // Validate các ô nhập số
    validateFieldNumber(){
        let isValid = true;

        this.form.find("input[DataType='Number']").each(function(){
            let value = $(this).val(),
                patt = new RegExp("^[0-9]*$");

            if(value && !patt.test(value)){
                $(this).parent().addClass("error-validate");
                $(this).attr("title", "Cần nhập đúng định dạng số");
                isValid = false;
            }else{
                $(this).parent().removeClass("error-validate");
            }
        });

        return isValid;
    }

    // Validate các phần tử khác
    validateCustom(){
        let me = this,
            isValid = true;

        // Duyệt từng phần tử
        this.form.find("input").each(function(){
            let value = $(this).val(),
                setField = $(this).attr("SetField");

            if(value){
                let resultCheck = me.validateItem(value, setField);

                if(!resultCheck.isValid){
                    $(this).parent().addClass("error-validate");
                    $(this).attr("title", resultCheck.tooltip);
                    isValid = false;
                }else{
                    $(this).parent().removeClass("error-validate");
                }
            }
        });

        return isValid;
    }

    // Validate từng phần tử
    validateItem(value, setField){
       return {isValid: true};
    }

    // Check trùng bản ghi
    validateCheckDuplicate(){
        let me = this,
        isValid = true;

        // Duyệt từng phần tử
        this.form.find("input[CheckDuplicate]").each(function(){
            let value = $(this).val(),
                text = $(this).prev().text().replace(" (*)",""),
                tooltip = text + " đã tồn tại trong hệ thống!",
                setField = $(this).attr("SetField");

            if(value){
                let isDuplicate = me.executeCheckDuplicate(value, setField);
                if(isDuplicate){
                    $(this).parent().addClass("error-validate");
                    $(this).attr("title", tooltip);
                    isValid = false;
                }else{
                    $(this).parent().removeClass("error-validate");
                }
            }
        });

        return isValid;
    }

    // Thực hiện check trùng
    executeCheckDuplicate(value, setField){
        let me = this,
            isDuplicate = false,
            entityName = me.jsCaller.config.entityName,
            mode = (me.jsCaller.editMode == Enum.EditMode.Add) ? "Add" : "Edit",
            data = {
                Id: me.jsCaller.recordCache.Id,
                Code: value,
                Mode: mode
            };
        
        CommonFn.PostPutAjax("POST", mappingApi[entityName].urlCheckDuplicate, data, function(response) {
            if(response.status == Enum.StatusResponse.Success){
                isDuplicate = (response.data);
            }
        }, false);
        
        return isDuplicate;
    }

    // Lưu dữ liệu vào DB
    saveChangeData(data){
        let me = this,
            entityName = me.jsCaller.config.entityName;

        if(me.jsCaller.editMode == Enum.EditMode.Add){
            CommonFn.PostPutAjax("POST", mappingApi[entityName].urlCreate, data, function(response) {
                if(response.status == Enum.StatusResponse.Success){
                    me.showMessageSuccess();
                    me.jsCaller.loadAjaxData();
                }
            });
        }else{
            CommonFn.PostPutAjax("PUT", mappingApi[entityName].urlUpdate, data, function(response) {
                if(response.status == Enum.StatusResponse.Success){
                    me.showMessageSuccess();
                    me.jsCaller.loadAjaxData();
                }
            });
        }
    }

    // Dùng để mapping dữ liệu
    mappingData(source, destination){
        for(var fieldName in source){
            destination[fieldName] = source[fieldName];
        }

        return CommonFn.Clone(destination);
    }

    // Hiển thị thông báo cất thành công
    showMessageSuccess(customMessage){
        let message = customMessage || "Cất dữ liệu thành công!";

        $("#success-alert strong").text(message);

        $("#success-alert").fadeTo(1500, 500).slideUp(500, function(){
            $("#success-alert").slideUp(500);
        });
    }

    // Hàm hiển thị form
    show(data){
        let title = '';
        this.form.parent().show();

        this.buildEnumDynamic();

        if(this.jsCaller.editMode == Enum.EditMode.Add){
            title = 'Thêm ' + this.title;
            this.resetFormData();
        }else{
            title = 'Sửa ' + this.title;
            data = this.customDataBeforeBinding(data);
            this.bindingData(data);
        }

        this.recordCache = {};
        this.form.find(".header-form").text(title);
    }

    // Đóng form
    close(){
        this.resetFormData();
        $(".wrapper-form").hide();
    }
    
    // Thiết lập chiều rộng, chiều cao form
    setSizeForm(width, height){
        this.form.width(width);
        this.form.height(height);
    }

    // Đổ dữ liệu vào form
    bindingData(data){
        this.form.find("[SetField]").each(function(){
            let setField = $(this).attr("SetField"),
                dataType = $(this).attr("DataType"),
                value = data[setField];

            if(value){
                switch(dataType){
                    case "Date":
                        $(this).val(value.substr(0,10));
                        break;
                    case "Enum":
                        $(this).val(value);
                        $(this).selectmenu("refresh");
                        break;
                    default:
                        $(this).val(value);
                }
            }
        });
    }

    // Lấy dữ liệu cả form
    submitData(){
        let form = this;
        let data = {};

        this.form.find("[SetField]").each(function(){
            let setField = $(this).attr("SetField"),
                dataType = $(this).attr("DataType");

                data[setField] = form.getDataForm($(this), dataType);
        });

        return data;
    }

    // Lấy dữ liệu từ các ô input
    getDataForm(field, dataType){
        let value = field.val();

        if(value){
            switch(dataType){
                case "Date":
                    value += " 00:00:00";
                    break;
                case "Enum":
                case "Number":
                    value = parseInt(value);
                    break;
                default:
                    value = value.trim();
            }
        }

        return value;
    }

    // Xóa dữ liệu form
    resetFormData(){
        this.form.find("[SetField]").each(function(){
            $(this).val("");
        });
        this.form.find(".error-validate").removeClass("error-validate");
        this.form.find("[Enum]").selectmenu('destroy').selectmenu({ style: 'dropdown' });
        this.form.find("[Enum]").val(1);
        this.form.find("[Enum]").selectmenu("refresh");
    }

    // Tạo các combo dữ liệu
    buildEnumDynamic(){
    }

    // Custom dữ liệu trước khi cất
    customData(data){
        return data;
    }

    // Custom dữ liệu trước khi binding
    customDataBeforeBinding(data){
        return data;
    }
}