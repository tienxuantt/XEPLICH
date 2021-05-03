// Form chọn phòng thi
class ChooseRoomForm extends BaseDetail {

    // Hàm khởi tạo
    constructor(formId, gridId, toolbarId, jsCaller, width, height){
        super(formId, gridId, toolbarId, jsCaller, width, height);
    }
    
    //override: Thiết lập các config
    getConfig() {
        let object = {
            entityName: "Rooms"
        };

        return object;
    }

    // Custom dữ liệu trước khi cất
    cusomDataBeforeSave(records){
        let data = [],
            semesterId = parseInt(localStorage.getItem("SemesterId"));

        records.filter(function(item){
            let obj = {
                RoomId: item.Id,
                SemesterId: semesterId
            };

            data.push(obj);
        });

        return data;
    }
}





