// Form thêm , sửa, xóa lịch thi
class CreateExamForm extends BaseForm {

    // Hàm khởi tạo
    constructor(jsCaller, idForm, width, height, title){
        super(jsCaller, idForm, width, height, title);

        this.initEventOther();
    }

    // Khởi tạo một số sự kiện khác
    initEventOther(){
        let me = this;

        this.form.find("[ComboboxName]").on('selectmenuchange', this.checkStatusInput);
        
        // Thêm timepicker cho ô nhập giờ
        $('input.timepicker').timepicker({
            change: function(){
                $(this).parent().removeClass("error-validate");
            }
        });
    }

    // Tạo các combo dữ liệu
    buildEnumDynamic(){
        let me = this,
            semesterId = parseInt(localStorage.getItem("SemesterId")),
            urlDetail = Constant.urlPaging.format(1000, 1),
            urlSubjects = mappingApi.SubjectSemesters.urlGetData.format(semesterId) + urlDetail,
            urlRooms = mappingApi.RoomSetting.urlGetData.format(semesterId) + urlDetail;

        // Render danh sách học phần
        CommonFn.GetAjax(urlSubjects, function (response) {
            if(response.status == Enum.StatusResponse.Success){
                me.renderComboboxExam(response.data["SubjectSemesters"], "ChooseSubject", "SubjectName");
            }
        },false);

        // Render danh sách phòng thi
        CommonFn.GetAjax(urlRooms, function (response) {
            me.renderComboboxExam(response.data["RoomSemesters"], "ChooseRoom", "RoomName");
        },false);
    }

    // Render dữ liệu combo
    renderComboboxExam(listData, comboboxName, fieldName){
        let me = this,
            combo = $("[ComboboxName='"+ comboboxName +"'");

        if(listData && listData.length > 0){

            combo.html("");

            listData.filter(function(item){
                let option = $("<option value='2'></option>");

                option.text(item[fieldName]);
                option.attr("value", item.Id);
                combo.append(option);
            });

            if(listData.length > 0 && me.jsCaller.editMode == Enum.EditMode.Add){
                combo.val(listData[0].Id).selectmenu("refresh");
            }

            if(me.jsCaller.editMode == Enum.EditMode.Edit){
                let field = (fieldName == "RoomName") ? "RoomSemesterId" : "SubjectSemesterId",
                    value = me.jsCaller.recordCache[field];

               combo.val(value).selectmenu("refresh");
            }
        }
    }

    // Custom dữ liệu trước khi cất
    customData(data){
        let me = this;

            data.Date = data.Date.substr(0,10);
            data.StartTime = data.Date + ' ' + convertTimepicker(data.StartTime);
            data.EndTime = data.Date + ' ' + convertTimepicker(data.EndTime);

        return data;
    }

    // Custom dữ liệu trước khi binding
    customDataBeforeBinding(data){
        let me = this;

        data.StartTime = convertDateToPicker(data.Time.substr(0,5));
        data.EndTime = convertDateToPicker(data.Time.substr(6,5));

        return data;
    }

    // Xóa dữ liệu form
    resetFormData(){
        this.form.find("[SetField]").each(function(){
            $(this).val("");
        });
        this.form.find(".error-validate").removeClass("error-validate");
        this.form.find("[ComboboxName]").selectmenu('destroy').selectmenu({ style: 'dropdown' });
    }
}





