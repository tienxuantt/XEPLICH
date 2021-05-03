// Form thêm , sửa, xóa sinh viên thuộc học phần
class StudentSubjectForm extends BaseForm {

    // Hàm khởi tạo
    constructor(jsCaller, idForm, width, height, title){
        super(jsCaller, idForm, width, height, title);
    }

    // Validate từng phần tử
    validateItem(value, setField){
        let me = this;

        switch(setField){
            case "StudentCode": // Mã sinh viên
                return me.validateStudentCode(value);
            default:
                return {isValid: true};
        }
    }

    // Validate Mã sinh viên kiểm tra xem tồn tại không hệ thống không
    validateStudentCode(value){
        let me = this,
            statusResponse = 0,
            result = {},
            entityName = me.jsCaller.config.entityName,
            data = {
                StudentCode: value,
                SubjectSemesterId: me.jsCaller.masterData.Id
            };
        
        CommonFn.PostPutAjax("POST", mappingApi[entityName].urlCheckExistItem, data, function(response) {
            statusResponse = response.status;
        }, false);

        if(statusResponse == Enum.StatusResponse.NotFound){
            result.isValid = false;
            result.tooltip = "Mã sinh viên không tồn tại!";
        } else if(statusResponse == Enum.StatusResponse.Exists){
            result.isValid = false;
            result.tooltip = "Sinh viên đã tồn tại trong học phần!";
        }else{
            result.isValid = true;
        }

        return result;
    }

    // Dùng để mapping dữ liệu
    mappingData(source, destination){
        let me = this;

        source.SubjectSemesterId = me.jsCaller.masterData.Id;

        return source;
    }
}





