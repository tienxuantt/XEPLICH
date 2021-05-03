// Form thêm , sửa, xóa sinh viên
class StudentManagerForm extends BaseForm {

    // Hàm khởi tạo
    constructor(jsCaller, idForm, width, height, title){
        super(jsCaller, idForm, width, height, title);
    }

    // Validate từng phần tử
    validateItem(value, setField){
        let me = this;

        switch(setField){
            // case "Course": // Khóa học
            //     return me.validateCourses(value);
            case "Email": // Email
                return me.validateEmail(value);
            default:
                return {isValid: true};
        }
    }

    // Validate khóa học
    validateCourses(value){
        let result = {},
            patt = new RegExp("K[1-9]{1}[0-9]*$");

        if(patt.test(value)){
            result.isValid = true;
        }else{
            result.isValid = false;
            result.tooltip = "Cần nhập khóa học có dạng K61,K62...";
        }

        return result;
    }

    // Validate email
    validateEmail(value){
        let result = {},
            patt = new RegExp("^[a-z0-9][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$");

        if(patt.test(value)){
            result.isValid = true;
        }else{
            result.isValid = false;
            result.tooltip = "Cần nhập đúng định dạng email";
        }

        return result;
    }
}





