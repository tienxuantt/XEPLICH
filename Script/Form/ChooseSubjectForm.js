// Form chọn học phần
class ChooseSubjectForm extends BaseDetail {

    // Hàm khởi tạo
    constructor(formId, gridId, toolbarId, jsCaller, width, height){
        super(formId, gridId, toolbarId, jsCaller, width, height);
    }

    //override: Thiết lập các config
    getConfig() {
        let object = {
            entityName: "Subjects"
        };

        return object;
    }

    // Custom dữ liệu trước khi cất
    cusomDataBeforeSave(records){
        let data = [],
            semesterId = parseInt(localStorage.getItem("SemesterId"));

        records.filter(function(item){
            let obj = {
                Description: item.Description,
                SubjectId: item.Id,
                SemesterId: semesterId
            };

            data.push(obj);
        });

        return data;
    }
}





