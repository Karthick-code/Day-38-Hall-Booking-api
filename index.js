

const express = require("express");
const app = express();
const port = 3000;
//creating a room
var rooms = []
app.post("/create-room", (req, res) => {
    var num_of_seat = req.query.seats;
    var amenty = req.query.amenties;
    var price = req.query.price;
    var room_id = req.query.roomid;
    var room_name=req.query.roomname;
    var flag = 0;
    if (rooms.length != 0) {
        rooms.map((ele, ind) => {
            if (ele.id === room_id) {
                flag += 1;
            }
            //console.log(ind, rooms.length, flag)
        });
    }
    if (flag === 0) {
        var room_det = {
            id: room_id,
            room_name: room_name,
            numberofSeats: num_of_seat,
            amenty: amenty,
            price: price
        }
        rooms = [...rooms, room_det];
        //console.log(rooms)
        res.json({ message: "room created successfully", rooms })
    }
    else {
        res.json({ message: "Room id is already registered", rooms })
    }
});

//booking a room
var book_room=[];
app.post("/book-room",(req,res)=>{
    var cus_name=req.query.name;
    var date=req.query.date;
    var start_time=req.query.start;
    var end_time=req.query.end;
    var room_id=req.query.roomid;
    var flag=0;
    if(book_room.length!=0){
        book_room.map((ele, ind) => {
            if (ele.roomid === room_id) {
                if(ele.date===date){
                    if((start_time>=ele.start_time && start_time<=ele.end_time)|| (end_time>=ele.start_time && end_time<=ele.end_time)){
                        flag+=1;
                    }
                }
            }
            //console.log(ind, book_room.length, flag)
        });
    }
    if (flag === 0) {
        var booking_det = {
            roomid: room_id,
            cus_name:cus_name,
            date: date,
            start_time:start_time,
            end_time:end_time
        }
        book_room = [...book_room, booking_det];
        //console.log(book_room)
        res.json({ message: "room booked successfully", book_room })
    }
    else {
        res.json({ message: "Room id is already booked", book_room })
    }
    

})

//list all rooms with booked data

app.get("/list-rooms",(req,res)=>{
    var list_rooms=[];
    rooms.map((x)=>{
        var roomid=x.id;
        var booked_status="Not-Booked";
        
        var y=book_room.filter((ele)=>{return ele.roomid===roomid})//return ele.roomid===roomid
        if(y!=null){
            booked_status="Booked"
        }
        y.map((z)=>{
            var booking_rooms = {
                
                roomname:x.room_name,
                booked_status:booked_status,
                cus_name:z.cus_name,
                date: z.date,
                start_time:z.start_time,
                end_time: z.end_time
            }
            list_rooms = [...list_rooms, booking_rooms];
            
        })
        // console.log(y)
    })
    res.json({ message: "List of rooms", list_rooms })

})



//list all customers with booked data

app.get("/list-customer",(req,res)=>{
    var list_customer=[];
    rooms.map((x)=>{
        var roomid=x.id;
        var y=book_room.filter((ele)=>{return ele.roomid===roomid})//return ele.roomid===roomid
        
        y.map((z)=>{
            var customer_list = {
                
                roomname:x.room_name,
                cus_name:z.cus_name,
                date: z.date,
                start_time:z.start_time,
                end_time: z.end_time
            }
            list_customer = [...list_customer, customer_list];
            
        })
                
        
    })
    res.json({ message: "List of customers", list_customer })

})

//list how many times individual customer booked a room

app.get("/customer-booking-count", (req, res) => {
    const bookingCounts = book_room.reduce((acc, booking) => {
        acc[booking.cus_name] = (acc[booking.cus_name] || 0) + 1;
        return acc;
    }, {});

    const customerBookingCounts = Object.entries(bookingCounts).map(([cus_name, count]) => ({
        cus_name,
        booking_count: count
    }));

    res.json({ message: "Customer booking counts", customerBookingCounts });
});

// app.get("/customer-booking-count", (req, res) => {
//     const bookingCounts = {};

//     book_room.forEach((booking) => {
//         if (bookingCounts[booking.cus_name]) {
//             bookingCounts[booking.cus_name]++;
//         } else {
//             bookingCounts[booking.cus_name] = 1;
//         }
//     });

//     const customerBookingCounts = Object.entries(bookingCounts).map(([cus_name, count]) => ({
//         cus_name,
//         booking_count: count
//     }));

//     res.json({ message: "Customer booking counts", customerBookingCounts });
// });


app.get("/customer-booked",(req,res)=>{
    var list_customer=[];
    rooms.map((x)=>{
        var roomid=x.id;
        var y=book_room.filter((ele)=>{return ele.roomid===roomid})//return ele.roomid===roomid

        y.map((z)=>{
            var customer_list = {

                roomname:x.room_name,
                cus_name:z.cus_name,
                date: z.date,
                start_time:z.start_time,
                end_time: z.end_time
            }
            list_customer = [...list_customer, customer_list];

        })


    })
    var count=0;
    list_customer.map((ele)=>{
        count=count+1;
    })
    res.json({ message: "List of customers", count })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});