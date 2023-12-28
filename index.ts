const nodeHtmlToImage = require("node-html-to-image");
const ejs = require("ejs");
const fs = require("fs/promises");
const data = [
  {
    subject_id: 1,
    subject_name: "مقدمة في البرمجة",
    subject_code: "ITGS122",
    subject_department: "القسم العام",
    midterm: {
      date: "2023-12-02",
      period: 1,
    },
    final: {
      date: "2024-01-06",
      period: 1,
    },
    groups: [
      {
        group_code: "B",
        professor: "أ. احمد علي الهوني",
        lectures: [
          {
            day: "السبت",
            start_time: "8:00",
            end_time: "10:00",
            room: "(مدرج الهوني - مبني الكلية)",
          },
          {
            day: "الأربعاء",
            start_time: "8:00",
            end_time: "10:00",
            room: "(مدرج الهوني - مبني الكلية)",
          },
        ],
      },
      {
        group_code: "A",
        professor: "د. عبدالسلام منصور الشريف",
        lectures: [
          {
            day: "الأحد",
            start_time: "10:00",
            end_time: "12:00",
            room: "(مدرج الهوني - مبني الكلية)",
          },
          {
            day: "الثلاثاء",
            start_time: "10:00",
            end_time: "12:00",
            room: "(مدرج الهوني - مبني الكلية)",
          },
        ],
      },
      {
        group_code: "C",
        professor: "أ. بيرم علي زرتي",
        lectures: [
          {
            day: "الإثنين",
            start_time: "4:00",
            end_time: "6:00",
            room: "(مدرج الهوني - مبني الكلية)",
          },
          {
            day: "الخميس",
            start_time: "10:00",
            end_time: "12:00",
            room: "(مدرج الهوني - مبني الكلية)",
          },
        ],
      },
    ],
  },
  {
    subject_id: 2,
    subject_name: "تصميم الدوائر المنطقية",
    subject_code: "ITGS126",
    subject_department: "القسم العام",
    midterm: {
      date: "2023-12-07",
      period: 1,
    },
    final: {
      date: "2024-01-15",
      period: 1,
    },
    groups: [
      {
        group_code: "A",
        professor: "ناجية خالد بن سعود",
        lectures: [
          {
            day: "السبت",
            start_time: "8:00",
            end_time: "10:00",
            room: "(القاعة 2/15 - الكيمياء)",
          },
          {
            day: "الثلاثاء",
            start_time: "8:00",
            end_time: "10:00",
            room: "(القاعة 2/15 - الكيمياء)",
          },
        ],
      },
    ],
  },
];
const run = async () => {
  const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  const timeSlots = ["8:00", "10:00", "12:00", "2:00", "4:00", "6:00"];
  const UITimeSlots = [
    "8:00 - 9:30",
    "9:30 - 11:00",
    "11:00 - 12:30",
    "12:30 - 2:00",
    "2:00 - 3:30",
    "3:30 - 5:00",
  ];
  const getLecturesByTimeSlot = (timeSlot: string, day: string) => {
    const lectures: {
      subjectName: string;
      groupCode: string;
      professor: string;
      room: string;
    }[] = [];
    data.forEach((subject) => {
      subject.groups.forEach((group) => {
        group.lectures.forEach((lecture) => {
          if (lecture.start_time === timeSlot && lecture.day === day) {
            lectures.push({
              subjectName: subject.subject_name,
              groupCode: group.group_code,
              professor: group.professor,
              room: lecture.room,
            });
          }
        });
      });
    });
    return lectures;
  };
  let html = "";
  days.forEach((day) => {
    html += `<tr data-v-b58b6465=""><th class="day" data-v-b58b6465="">${day}</th>`;
    timeSlots.forEach((timeSlot) => {
      const lectures = getLecturesByTimeSlot(timeSlot, day);
      html += `<td data-v-b58b6465="">`;
      lectures.forEach((lecture) => {
        html += `<div data-v-b58b6465="" class="info">
                          <div data-v-b58b6465="" class="main-info" color="primary">${lecture.subjectName} (${lecture.groupCode})</div>
                          <div data-v-b58b6465="" class="sub-info" color="primary">${lecture.professor} ${lecture.room}</div>
                       </div>`;
      });
      html += `</td>`;
    });
    html += `</tr>`;
  });
  const ejs_string = await fs.readFile("./html.ejs", "utf8");
  const newhtml = ejs.render(ejs_string, {
    html,
  });
  nodeHtmlToImage({
    selector: "table",
    puppeteerArgs: {
      defaultViewport: {
        width: 3000,
        height: 15000,
      },
    },
    output: "./image.png",
    html: newhtml,
  });
  return;
};
run();
