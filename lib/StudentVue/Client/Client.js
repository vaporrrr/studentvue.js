(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap", "../Message/Message", "date-fns", "../../Constants/EventType", "lodash", "../../Constants/ResourceType", "../ReportCard/ReportCard", "../Document/Document", "../RequestException/RequestException", "../../utils/XMLFactory/XMLFactory", "../../utils/cache/cache", "./Client.helpers"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"), require("../Message/Message"), require("date-fns"), require("../../Constants/EventType"), require("lodash"), require("../../Constants/ResourceType"), require("../ReportCard/ReportCard"), require("../Document/Document"), require("../RequestException/RequestException"), require("../../utils/XMLFactory/XMLFactory"), require("../../utils/cache/cache"), require("./Client.helpers"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap, global.Message, global.dateFns, global.EventType, global.lodash, global.ResourceType, global.ReportCard, global.Document, global.RequestException, global.XMLFactory, global.cache, global.Client);
    global.Client = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap, _Message, _dateFns, _EventType, _lodash, _ResourceType, _ReportCard, _Document, _RequestException, _XMLFactory, _cache, _Client) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _soap = _interopRequireDefault(_soap);
  _Message = _interopRequireDefault(_Message);
  _EventType = _interopRequireDefault(_EventType);
  _lodash = _interopRequireDefault(_lodash);
  _ResourceType = _interopRequireDefault(_ResourceType);
  _ReportCard = _interopRequireDefault(_ReportCard);
  _Document = _interopRequireDefault(_Document);
  _RequestException = _interopRequireDefault(_RequestException);
  _XMLFactory = _interopRequireDefault(_XMLFactory);
  _cache = _interopRequireDefault(_cache);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  /**
   * The StudentVUE Client to access the API
   * @constructor
   * @extends {soap.Client}
   */
  class Client extends _soap.default.Client {
    constructor(credentials, hostUrl) {
      super(credentials);
      this.hostUrl = hostUrl;
    }

    /**
     * Validate's the user's credentials. It will throw an error if credentials are incorrect
     */
    validateCredentials() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'login test',
          validateErrors: false
        }).then(response => {
          if (response.RT_ERROR[0]['@_ERROR_MESSAGE'][0] === 'login test is not a valid method.') {
            res();
          } else rej(new _RequestException.default(response));
        }).catch(rej);
      });
    }

    /**
     * Gets the student's documents from synergy servers
     * @returns {Promise<Document[]>}> Returns a list of student documents
     * @description
     * ```js
     * const documents = await client.documents();
     * const document = documents[0];
     * const files = await document.get();
     * const base64collection = files.map((file) => file.base64);
     * ```
     */
    documents() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'GetStudentDocumentInitialData',
          paramStr: {
            childIntId: 0
          }
        }).then(xmlObject => {
          var _a = xmlObject['StudentDocuments'][0].StudentDocumentDatas[0].StudentDocumentData;
          var _f = xml => {
            return new _Document.default(xml, super.credentials);
          };
          var _r = [];
          for (var _i = 0; _i < _a.length; _i++) {
            _r.push(_f(_a[_i], _i, _a));
          }
          res(_r);
        }).catch(rej);
      });
    }

    /**
     * Gets a list of report cards
     * @returns {Promise<ReportCard[]>} Returns a list of report cards that can fetch a file
     * @description
     * ```js
     * const reportCards = await client.reportCards();
     * const files = await Promise.all(reportCards.map((card) => card.get()));
     * const base64arr = files.map((file) => file.base64); // ["JVBERi0...", "dUIoa1...", ...];
     * ```
     */
    reportCards() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'GetReportCardInitialData',
          paramStr: {
            childIntId: 0
          }
        }).then(xmlObject => {
          var _a2 = xmlObject.RCReportingPeriodData[0].RCReportingPeriods[0].RCReportingPeriod;
          var _f2 = xml => {
            return new _ReportCard.default(xml, super.credentials);
          };
          var _r2 = [];
          for (var _i2 = 0; _i2 < _a2.length; _i2++) {
            _r2.push(_f2(_a2[_i2], _i2, _a2));
          }
          res(_r2);
        }).catch(rej);
      });
    }

    /**
     * Gets the student's school's information
     * @returns {Promise<SchoolInfo>} Returns the information of the student's school
     * @description
     * ```js
     * await client.schoolInfo();
     *
     * client.schoolInfo().then((schoolInfo) => {
     *  console.log(_.uniq(schoolInfo.staff.map((staff) => staff.name))); // List all staff positions using lodash
     * })
     * ```
     */
    schoolInfo() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'StudentSchoolInfo',
          paramStr: {
            childIntID: 0
          }
        }).then(({
          StudentSchoolInfoListing: [xmlObject]
        }) => {
          var _a3 = xmlObject.StaffLists[0].StaffList;
          var _f3 = staff => {
            return {
              name: staff['@_Name'][0],
              email: staff['@_EMail'][0],
              staffGu: staff['@_StaffGU'][0],
              jobTitle: staff['@_Title'][0],
              extn: staff['@_Extn'][0],
              phone: staff['@_Phone'][0]
            };
          };
          var _r3 = [];
          for (var _i3 = 0; _i3 < _a3.length; _i3++) {
            _r3.push(_f3(_a3[_i3], _i3, _a3));
          }
          res({
            school: {
              address: xmlObject['@_SchoolAddress'][0],
              addressAlt: xmlObject['@_SchoolAddress2'][0],
              city: xmlObject['@_SchoolCity'][0],
              zipCode: xmlObject['@_SchoolZip'][0],
              phone: xmlObject['@_Phone'][0],
              altPhone: xmlObject['@_Phone2'][0],
              principal: {
                name: xmlObject['@_Principal'][0],
                email: xmlObject['@_PrincipalEmail'][0],
                staffGu: xmlObject['@_PrincipalGu'][0]
              }
            },
            staff: _r3
          });
        }).catch(rej);
      });
    }

    /**
     * Gets the schedule of the student
     * @param {number} termIndex The index of the term.
     * @returns {Promise<Schedule>} Returns the schedule of the student
     * @description
     * ```js
     * await schedule(0) // -> { term: { index: 0, name: '1st Qtr Progress' }, ... }
     * ```
     */
    schedule(termIndex) {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'StudentClassList',
          paramStr: {
            childIntId: 0,
            ...(termIndex != null ? {
              TermIndex: termIndex
            } : {})
          }
        }).then(xmlObject => {
          var _a4 = xmlObject.StudentClassSchedule[0].TermLists[0].TermListing;
          var _f4 = term => {
            return {
              date: {
                start: (0, _Client.parseDateString)(term['@_BeginDate'][0]),
                end: (0, _Client.parseDateString)(term['@_EndDate'][0])
              },
              index: Number(term['@_TermIndex'][0]),
              name: term['@_TermName'][0],
              schoolYearTermCodeGu: term['@_SchoolYearTrmCodeGU'][0]
            };
          };
          var _r4 = [];
          for (var _i4 = 0; _i4 < _a4.length; _i4++) {
            _r4.push(_f4(_a4[_i4], _i4, _a4));
          }
          res({
            term: {
              index: Number(xmlObject.StudentClassSchedule[0]['@_TermIndex'][0]),
              name: xmlObject.StudentClassSchedule[0]['@_TermIndexName'][0]
            },
            error: xmlObject.StudentClassSchedule[0]['@_ErrorMessage'][0],
            today: typeof xmlObject.StudentClassSchedule[0].TodayScheduleInfoData[0].SchoolInfos[0] !== 'string' ? xmlObject.StudentClassSchedule[0].TodayScheduleInfoData[0].SchoolInfos[0].SchoolInfo.map(school => {
              return {
                name: school['@_SchoolName'][0],
                bellScheduleName: school['@_BellSchedName'][0],
                classes: typeof school.Classes[0] !== 'string' ? school.Classes[0].ClassInfo.map(course => {
                  return {
                    period: Number(course['@_Period'][0]),
                    attendanceCode: course.AttendanceCode[0],
                    date: {
                      start: (0, _Client.parseDateString)(course['@_StartDate'][0]),
                      end: (0, _Client.parseDateString)(course['@_EndDate'][0])
                    },
                    name: course['@_ClassName'][0],
                    sectionGu: course['@_SectionGU'][0],
                    teacher: {
                      email: course['@_TeacherEmail'][0],
                      emailSubject: course['@_EmailSubject'][0],
                      name: course['@_TeacherName'][0],
                      staffGu: course['@_StaffGU'][0],
                      url: course['@_TeacherURL'][0]
                    },
                    url: course['@_ClassURL'][0],
                    time: {
                      start: (0, _dateFns.parse)(course['@_StartTime'][0], 'hh:mm a', Date.now()),
                      end: (0, _dateFns.parse)(course['@_EndTime'][0], 'hh:mm a', Date.now())
                    },
                    room: course['@_RoomName'][0]
                  };
                }) : []
              };
            }) : [],
            classes: typeof xmlObject.StudentClassSchedule[0].ClassLists[0] !== 'string' ? xmlObject.StudentClassSchedule[0].ClassLists[0].ClassListing.map(studentClass => {
              return {
                name: studentClass['@_CourseTitle'][0],
                period: Number(studentClass['@_Period'][0]),
                room: studentClass['@_RoomName'][0],
                sectionGu: studentClass['@_SectionGU'][0],
                teacher: {
                  name: studentClass['@_Teacher'][0],
                  email: studentClass['@_TeacherEmail'][0],
                  staffGu: studentClass['@_TeacherStaffGU'][0]
                }
              };
            }) : [],
            terms: _r4
          });
        }).catch(rej);
      });
    }

    /**
     * Returns the attendance of the student
     * @returns {Promise<Attendance>} Returns an Attendance object
     * @description
     * ```js
     * client.attendance()
     *  .then(console.log); // -> { type: 'Period', period: {...}, schoolName: 'University High School', absences: [...], periodInfos: [...] }
     * ```
     */
    attendance() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'Attendance',
          paramStr: {
            childIntId: 0
          }
        }).then(attendanceXMLObject => {
          const xmlObject = attendanceXMLObject.Attendance[0];
          var _a5 = xmlObject.TotalActivities[0].PeriodTotal;
          var _f5 = (pd, i) => {
            return {
              period: Number(pd['@_Number'][0]),
              total: {
                excused: Number(xmlObject.TotalExcused[0].PeriodTotal[i]['@_Total'][0]),
                tardies: Number(xmlObject.TotalTardies[0].PeriodTotal[i]['@_Total'][0]),
                unexcused: Number(xmlObject.TotalUnexcused[0].PeriodTotal[i]['@_Total'][0]),
                activities: Number(xmlObject.TotalActivities[0].PeriodTotal[i]['@_Total'][0]),
                unexcusedTardies: Number(xmlObject.TotalUnexcusedTardies[0].PeriodTotal[i]['@_Total'][0])
              }
            };
          };
          var _r5 = [];
          for (var _i5 = 0; _i5 < _a5.length; _i5++) {
            _r5.push(_f5(_a5[_i5], _i5, _a5));
          }
          res({
            type: xmlObject['@_Type'][0],
            period: {
              total: Number(xmlObject['@_PeriodCount'][0]),
              start: Number(xmlObject['@_StartPeriod'][0]),
              end: Number(xmlObject['@_EndPeriod'][0])
            },
            schoolName: xmlObject['@_SchoolName'][0],
            absences: xmlObject.Absences[0].Absence ? xmlObject.Absences[0].Absence.map(absence => {
              return {
                date: (0, _Client.parseDateString)(absence['@_AbsenceDate'][0]),
                reason: absence['@_Reason'][0],
                note: absence['@_Note'][0],
                description: absence['@_CodeAllDayDescription'][0],
                periods: absence.Periods[0].Period.map(period => {
                  return {
                    period: Number(period['@_Number'][0]),
                    name: period['@_Name'][0],
                    reason: period['@_Reason'][0],
                    course: period['@_Course'][0],
                    staff: {
                      name: period['@_Staff'][0],
                      staffGu: period['@_StaffGU'][0],
                      email: period['@_StaffEMail'][0]
                    },
                    orgYearGu: period['@_OrgYearGU'][0]
                  };
                })
              };
            }) : [],
            periodInfos: _r5
          });
        }).catch(rej);
      });
    }

    /**
     * Returns the gradebook of the student
     * @param {number} reportingPeriodIndex The timeframe that the gradebook should return
     * @returns {Promise<Gradebook>} Returns a Gradebook object
     * @description
     * ```js
     * const gradebook = await client.gradebook();
     * console.log(gradebook); // { error: '', type: 'Traditional', reportingPeriod: {...}, courses: [...] };
     *
     * await client.gradebook(0) // Some schools will have ReportingPeriodIndex 0 as "1st Quarter Progress"
     * await client.gradebook(7) // Some schools will have ReportingPeriodIndex 7 as "4th Quarter"
     * ```
     */
    gradebook(reportingPeriodIndex) {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'Gradebook',
          paramStr: {
            childIntId: 0,
            ...(reportingPeriodIndex != null ? {
              ReportPeriod: reportingPeriodIndex
            } : {})
          }
        }, xml => {
          return new _XMLFactory.default(xml).encodeAttribute('MeasureDescription', 'HasDropBox').encodeAttribute('Measure', 'Type').toString();
        }).then(xmlObject => {
          var _a6 = xmlObject.Gradebook[0].ReportingPeriods[0].ReportPeriod;
          var _f6 = period => {
            return {
              date: {
                start: (0, _Client.parseDateString)(period['@_StartDate'][0]),
                end: (0, _Client.parseDateString)(period['@_EndDate'][0])
              },
              name: period['@_GradePeriod'][0],
              index: Number(period['@_Index'][0])
            };
          };
          var _r6 = [];
          for (var _i6 = 0; _i6 < _a6.length; _i6++) {
            _r6.push(_f6(_a6[_i6], _i6, _a6));
          }
          var _a7 = xmlObject.Gradebook[0].Courses[0].Course;
          var _f7 = course => {
            var _a8 = course.Marks[0].Mark;
            var _f8 = mark => {
              return {
                name: mark['@_MarkName'][0],
                calculatedScore: {
                  string: mark['@_CalculatedScoreString'][0],
                  raw: Number(mark['@_CalculatedScoreRaw'][0])
                },
                weightedCategories: typeof mark['GradeCalculationSummary'][0] !== 'string' ? mark['GradeCalculationSummary'][0].AssignmentGradeCalc.map(weighted => {
                  return {
                    type: weighted['@_Type'][0],
                    calculatedMark: weighted['@_CalculatedMark'][0],
                    weight: {
                      evaluated: weighted['@_WeightedPct'][0],
                      standard: weighted['@_Weight'][0]
                    },
                    points: {
                      current: Number(weighted['@_Points'][0]),
                      possible: Number(weighted['@_PointsPossible'][0])
                    }
                  };
                }) : [],
                assignments: typeof mark.Assignments[0] !== 'string' ? mark.Assignments[0].Assignment.map(assignment => {
                  return {
                    gradebookId: assignment['@_GradebookID'][0],
                    name: decodeURI(assignment['@_Measure'][0]),
                    type: assignment['@_Type'][0],
                    date: {
                      start: (0, _Client.parseDateString)(assignment['@_Date'][0]),
                      due: (0, _Client.parseDateString)(assignment['@_DueDate'][0])
                    },
                    score: {
                      type: assignment['@_ScoreType'][0],
                      value: assignment['@_Score'][0]
                    },
                    points: assignment['@_Points'][0],
                    notes: assignment['@_Notes'][0],
                    teacherId: assignment['@_TeacherID'][0],
                    description: decodeURI(assignment['@_MeasureDescription'][0]),
                    hasDropbox: JSON.parse(assignment['@_HasDropBox'][0]),
                    studentId: assignment['@_StudentID'][0],
                    dropboxDate: {
                      start: (0, _Client.parseDateString)(assignment['@_DropStartDate'][0]),
                      end: (0, _Client.parseDateString)(assignment['@_DropEndDate'][0])
                    },
                    resources: typeof assignment.Resources[0] !== 'string' ? assignment.Resources[0].Resource.map(rsrc => {
                      switch (rsrc['@_Type'][0]) {
                        case 'File':
                          {
                            const fileRsrc = rsrc;
                            return {
                              type: _ResourceType.default.FILE,
                              file: {
                                type: fileRsrc['@_FileType'][0],
                                name: fileRsrc['@_FileName'][0],
                                uri: this.hostUrl + fileRsrc['@_ServerFileName'][0]
                              },
                              resource: {
                                date: (0, _Client.parseDateString)(fileRsrc['@_ResourceDate'][0]),
                                id: fileRsrc['@_ResourceID'][0],
                                name: fileRsrc['@_ResourceName'][0]
                              }
                            };
                          }
                        case 'URL':
                          {
                            const urlRsrc = rsrc;
                            return {
                              url: urlRsrc['@_URL'][0],
                              type: _ResourceType.default.URL,
                              resource: {
                                date: (0, _Client.parseDateString)(urlRsrc['@_ResourceDate'][0]),
                                id: urlRsrc['@_ResourceID'][0],
                                name: urlRsrc['@_ResourceName'][0],
                                description: urlRsrc['@_ResourceDescription'][0]
                              },
                              path: urlRsrc['@_ServerFileName'][0]
                            };
                          }
                        default:
                          rej(`Type ${rsrc['@_Type'][0]} does not exist as a type. Add it to type declarations.`);
                      }
                    }) : []
                  };
                }) : []
              };
            };
            var _r8 = [];
            for (var _i8 = 0; _i8 < _a8.length; _i8++) {
              _r8.push(_f8(_a8[_i8], _i8, _a8));
            }
            return {
              period: Number(course['@_Period'][0]),
              title: course['@_Title'][0],
              room: course['@_Room'][0],
              staff: {
                name: course['@_Staff'][0],
                email: course['@_StaffEMail'][0],
                staffGu: course['@_StaffGU'][0]
              },
              marks: _r8
            };
          };
          var _r7 = [];
          for (var _i7 = 0; _i7 < _a7.length; _i7++) {
            _r7.push(_f7(_a7[_i7], _i7, _a7));
          }
          res({
            error: xmlObject.Gradebook[0]['@_ErrorMessage'][0],
            type: xmlObject.Gradebook[0]['@_Type'][0],
            reportingPeriod: {
              current: {
                index: reportingPeriodIndex ?? Number(xmlObject.Gradebook[0].ReportingPeriods[0].ReportPeriod.find(x => {
                  return x['@_GradePeriod'][0] === xmlObject.Gradebook[0].ReportingPeriod[0]['@_GradePeriod'][0];
                })?.['@_Index'][0]),
                date: {
                  start: (0, _Client.parseDateString)(xmlObject.Gradebook[0].ReportingPeriod[0]['@_StartDate'][0]),
                  end: (0, _Client.parseDateString)(xmlObject.Gradebook[0].ReportingPeriod[0]['@_EndDate'][0])
                },
                name: xmlObject.Gradebook[0].ReportingPeriod[0]['@_GradePeriod'][0]
              },
              available: _r6
            },
            courses: _r7
          });
        }).catch(rej);
      });
    }

    /**
     * Get a list of messages of the student
     * @returns {Promise<Message[]>} Returns an array of messages of the student
     * @description
     * ```js
     * await client.messages(); // -> [{ id: 'E972F1BC-99A0-4CD0-8D15-B18968B43E08', type: 'StudentActivity', ... }, { id: '86FDA11D-42C7-4249-B003-94B15EB2C8D4', type: 'StudentActivity', ... }]
     * ```
     */
    messages() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'GetPXPMessages',
          paramStr: {
            childIntId: 0
          }
        }, xml => {
          return new _XMLFactory.default(xml).encodeAttribute('Content', 'Read').toString();
        }).then(xmlObject => {
          var _a9 = xmlObject.PXPMessagesData[0].MessageListings[0].MessageListing;
          var _f9 = message => {
            return new _Message.default(message, super.credentials, this.hostUrl);
          };
          var _r9 = [];
          for (var _i9 = 0; _i9 < _a9.length; _i9++) {
            _r9.push(_f9(_a9[_i9], _i9, _a9));
          }
          res(_r9);
        }).catch(rej);
      });
    }

    /**
     * Gets the info of a student
     * @returns {Promise<StudentInfo>} StudentInfo object
     * @description
     * ```js
     * studentInfo().then(console.log) // -> { student: { name: 'Evan Davis', nickname: '', lastName: 'Davis' }, ...}
     * ```
     */
    studentInfo() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'StudentInfo',
          paramStr: {
            childIntId: 0
          }
        }).then(xmlObjectData => {
          res({
            student: {
              name: xmlObjectData.StudentInfo[0].FormattedName[0],
              lastName: xmlObjectData.StudentInfo[0].LastNameGoesBy[0],
              nickname: xmlObjectData.StudentInfo[0].NickName[0]
            },
            birthDate: (0, _Client.parseDateString)(xmlObjectData.StudentInfo[0].BirthDate[0]),
            track: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Track),
            address: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Address),
            photo: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Photo),
            counselor: xmlObjectData.StudentInfo[0].CounselorName && xmlObjectData.StudentInfo[0].CounselorEmail && xmlObjectData.StudentInfo[0].CounselorStaffGU ? {
              name: xmlObjectData.StudentInfo[0].CounselorName[0],
              email: xmlObjectData.StudentInfo[0].CounselorEmail[0],
              staffGu: xmlObjectData.StudentInfo[0].CounselorStaffGU[0]
            } : undefined,
            currentSchool: xmlObjectData.StudentInfo[0].CurrentSchool[0],
            dentist: xmlObjectData.StudentInfo[0].Dentist ? {
              name: xmlObjectData.StudentInfo[0].Dentist[0]['@_Name'][0],
              phone: xmlObjectData.StudentInfo[0].Dentist[0]['@_Phone'][0],
              extn: xmlObjectData.StudentInfo[0].Dentist[0]['@_Extn'][0],
              office: xmlObjectData.StudentInfo[0].Dentist[0]['@_Office'][0]
            } : undefined,
            physician: xmlObjectData.StudentInfo[0].Physician ? {
              name: xmlObjectData.StudentInfo[0].Physician[0]['@_Name'][0],
              phone: xmlObjectData.StudentInfo[0].Physician[0]['@_Phone'][0],
              extn: xmlObjectData.StudentInfo[0].Physician[0]['@_Extn'][0],
              hospital: xmlObjectData.StudentInfo[0].Physician[0]['@_Hospital'][0]
            } : undefined,
            id: (0, _Client.optional)(xmlObjectData.StudentInfo[0].PermID),
            orgYearGu: (0, _Client.optional)(xmlObjectData.StudentInfo[0].OrgYearGU),
            phone: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Phone),
            email: (0, _Client.optional)(xmlObjectData.StudentInfo[0].EMail),
            emergencyContacts: xmlObjectData.StudentInfo[0].EmergencyContacts ? xmlObjectData.StudentInfo[0].EmergencyContacts[0].EmergencyContact.map(contact => {
              return {
                name: (0, _Client.optional)(contact['@_Name']),
                phone: {
                  home: (0, _Client.optional)(contact['@_HomePhone']),
                  mobile: (0, _Client.optional)(contact['@_MobilePhone']),
                  other: (0, _Client.optional)(contact['@_OtherPhone']),
                  work: (0, _Client.optional)(contact['@_WorkPhone'])
                },
                relationship: (0, _Client.optional)(contact['@_Relationship'])
              };
            }) : [],
            gender: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Gender),
            grade: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Grade),
            lockerInfoRecords: (0, _Client.optional)(xmlObjectData.StudentInfo[0].LockerInfoRecords),
            homeLanguage: (0, _Client.optional)(xmlObjectData.StudentInfo[0].HomeLanguage),
            homeRoom: (0, _Client.optional)(xmlObjectData.StudentInfo[0].HomeRoom),
            homeRoomTeacher: {
              email: (0, _Client.optional)(xmlObjectData.StudentInfo[0].HomeRoomTchEMail),
              name: (0, _Client.optional)(xmlObjectData.StudentInfo[0].HomeRoomTch),
              staffGu: (0, _Client.optional)(xmlObjectData.StudentInfo[0].HomeRoomTchStaffGU)
            },
            additionalInfo: xmlObjectData.StudentInfo[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox ? xmlObjectData.StudentInfo[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox.map(definedBox => {
              return {
                id: (0, _Client.optional)(definedBox['@_GroupBoxID']),
                // string | undefined
                type: definedBox['@_GroupBoxLabel'][0],
                // string
                vcId: (0, _Client.optional)(definedBox['@_VCID']),
                // string | undefined
                items: definedBox.UserDefinedItems[0].UserDefinedItem.map(item => {
                  return {
                    source: {
                      element: item['@_SourceElement'][0],
                      object: item['@_SourceObject'][0]
                    },
                    vcId: item['@_VCID'][0],
                    value: item['@_Value'][0],
                    type: item['@_ItemType'][0]
                  };
                })
              };
            }) : []
          });
        }).catch(rej);
      });
    }
    fetchEventsWithinInterval(date) {
      return super.processRequest({
        methodName: 'StudentCalendar',
        paramStr: {
          childIntId: 0,
          RequestDate: date.toISOString()
        }
      }, xml => {
        return new _XMLFactory.default(xml).encodeAttribute('Title', 'Icon').toString();
      });
    }

    /**
     *
     * @param {CalendarOptions} options Options to provide for calendar method. An interval is required.
     * @returns {Promise<Calendar>} Returns a Calendar object
     * @description
     * ```js
     * client.calendar({ interval: { start: parseDate('5/1/2022'), end: parseDate('8/1/2021') }, concurrency: null }); // -> Limitless concurrency (not recommended)
     *
     * const calendar = await client.calendar({ interval: { ... }});
     * console.log(calendar); // -> { schoolDate: {...}, outputRange: {...}, events: [...] }
     * ```
     */
    async calendar(options = {}) {
      const defaultOptions = {
        concurrency: 7,
        ...options
      };
      const cal = await _cache.default.memo(() => {
        return this.fetchEventsWithinInterval(new Date());
      });
      const schoolEndDate = options.interval?.end ?? (0, _Client.parseDateString)(cal.CalendarListing[0]['@_SchoolEndDate'][0]);
      const schoolStartDate = options.interval?.start ?? (0, _Client.parseDateString)(cal.CalendarListing[0]['@_SchoolBegDate'][0]);
      return new Promise((res, rej) => {
        const monthsWithinSchoolYear = (0, _dateFns.eachMonthOfInterval)({
          start: schoolStartDate,
          end: schoolEndDate
        });
        const getAllEventsWithinSchoolYear = () => {
          return defaultOptions.concurrency == null ? Promise.all(monthsWithinSchoolYear.map(date => {
            return this.fetchEventsWithinInterval(date);
          })) : (0, _Client.asyncPoolAll)(defaultOptions.concurrency, monthsWithinSchoolYear, date => {
            return this.fetchEventsWithinInterval(date);
          });
        };
        let memo = null;
        getAllEventsWithinSchoolYear().then(events => {
          const allEvents = events.reduce((prev, events) => {
            if (memo == null) {
              memo = {
                schoolDate: {
                  start: (0, _Client.parseDateString)(events.CalendarListing[0]['@_SchoolBegDate'][0]),
                  end: (0, _Client.parseDateString)(events.CalendarListing[0]['@_SchoolEndDate'][0])
                },
                outputRange: {
                  start: schoolStartDate,
                  end: schoolEndDate
                },
                events: []
              };
            }
            const rest = {
              ...memo,
              // This is to prevent re-initializing Date objects in order to improve performance
              events: [...(prev.events ? prev.events : []), ...(typeof events.CalendarListing[0].EventLists[0] !== 'string' ? events.CalendarListing[0].EventLists[0].EventList.map(event => {
                switch (event['@_DayType'][0]) {
                  case _EventType.default.ASSIGNMENT:
                    {
                      const assignmentEvent = event;
                      return {
                        title: decodeURI(assignmentEvent['@_Title'][0]),
                        addLinkData: assignmentEvent['@_AddLinkData'][0],
                        agu: assignmentEvent['@_AGU'] ? assignmentEvent['@_AGU'][0] : undefined,
                        date: (0, _Client.parseDateString)(assignmentEvent['@_Date'][0]),
                        dgu: assignmentEvent['@_DGU'][0],
                        link: assignmentEvent['@_Link'][0],
                        startTime: assignmentEvent['@_StartTime'][0],
                        type: _EventType.default.ASSIGNMENT,
                        viewType: assignmentEvent['@_ViewType'][0]
                      };
                    }
                  case _EventType.default.HOLIDAY:
                    {
                      return {
                        title: decodeURI(event['@_Title'][0]),
                        type: _EventType.default.HOLIDAY,
                        startTime: event['@_StartTime'][0],
                        date: (0, _Client.parseDateString)(event['@_Date'][0])
                      };
                    }
                  case _EventType.default.REGULAR:
                    {
                      const regularEvent = event;
                      return {
                        title: decodeURI(regularEvent['@_Title'][0]),
                        agu: regularEvent['@_AGU'] ? regularEvent['@_AGU'][0] : undefined,
                        date: (0, _Client.parseDateString)(regularEvent['@_Date'][0]),
                        description: regularEvent['@_EvtDescription'] ? regularEvent['@_EvtDescription'][0] : undefined,
                        dgu: regularEvent['@_DGU'] ? regularEvent['@_DGU'][0] : undefined,
                        link: regularEvent['@_Link'] ? regularEvent['@_Link'][0] : undefined,
                        startTime: regularEvent['@_StartTime'][0],
                        type: _EventType.default.REGULAR,
                        viewType: regularEvent['@_ViewType'] ? regularEvent['@_ViewType'][0] : undefined,
                        addLinkData: regularEvent['@_AddLinkData'] ? regularEvent['@_AddLinkData'][0] : undefined
                      };
                    }
                }
              }) : [])]
            };
            return rest;
          }, {});
          res({
            ...allEvents,
            events: _lodash.default.uniqBy(allEvents.events, item => {
              return item.title;
            })
          });
        }).catch(rej);
      });
    }
  }
  _exports.default = Client;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDbGllbnQiLCJzb2FwIiwiY29uc3RydWN0b3IiLCJjcmVkZW50aWFscyIsImhvc3RVcmwiLCJ2YWxpZGF0ZUNyZWRlbnRpYWxzIiwiUHJvbWlzZSIsInJlcyIsInJlaiIsInByb2Nlc3NSZXF1ZXN0IiwibWV0aG9kTmFtZSIsInZhbGlkYXRlRXJyb3JzIiwidGhlbiIsInJlc3BvbnNlIiwiUlRfRVJST1IiLCJSZXF1ZXN0RXhjZXB0aW9uIiwiY2F0Y2giLCJkb2N1bWVudHMiLCJwYXJhbVN0ciIsImNoaWxkSW50SWQiLCJ4bWxPYmplY3QiLCJTdHVkZW50RG9jdW1lbnREYXRhcyIsIlN0dWRlbnREb2N1bWVudERhdGEiLCJ4bWwiLCJEb2N1bWVudCIsInJlcG9ydENhcmRzIiwiUkNSZXBvcnRpbmdQZXJpb2REYXRhIiwiUkNSZXBvcnRpbmdQZXJpb2RzIiwiUkNSZXBvcnRpbmdQZXJpb2QiLCJSZXBvcnRDYXJkIiwic2Nob29sSW5mbyIsImNoaWxkSW50SUQiLCJTdHVkZW50U2Nob29sSW5mb0xpc3RpbmciLCJTdGFmZkxpc3RzIiwiU3RhZmZMaXN0Iiwic3RhZmYiLCJuYW1lIiwiZW1haWwiLCJzdGFmZkd1Iiwiam9iVGl0bGUiLCJleHRuIiwicGhvbmUiLCJzY2hvb2wiLCJhZGRyZXNzIiwiYWRkcmVzc0FsdCIsImNpdHkiLCJ6aXBDb2RlIiwiYWx0UGhvbmUiLCJwcmluY2lwYWwiLCJzY2hlZHVsZSIsInRlcm1JbmRleCIsIlRlcm1JbmRleCIsIlN0dWRlbnRDbGFzc1NjaGVkdWxlIiwiVGVybUxpc3RzIiwiVGVybUxpc3RpbmciLCJ0ZXJtIiwiZGF0ZSIsInN0YXJ0IiwicGFyc2VEYXRlU3RyaW5nIiwiZW5kIiwiaW5kZXgiLCJOdW1iZXIiLCJzY2hvb2xZZWFyVGVybUNvZGVHdSIsImVycm9yIiwidG9kYXkiLCJUb2RheVNjaGVkdWxlSW5mb0RhdGEiLCJTY2hvb2xJbmZvcyIsIlNjaG9vbEluZm8iLCJtYXAiLCJiZWxsU2NoZWR1bGVOYW1lIiwiY2xhc3NlcyIsIkNsYXNzZXMiLCJDbGFzc0luZm8iLCJjb3Vyc2UiLCJwZXJpb2QiLCJhdHRlbmRhbmNlQ29kZSIsIkF0dGVuZGFuY2VDb2RlIiwic2VjdGlvbkd1IiwidGVhY2hlciIsImVtYWlsU3ViamVjdCIsInVybCIsInRpbWUiLCJwYXJzZSIsIkRhdGUiLCJub3ciLCJyb29tIiwiQ2xhc3NMaXN0cyIsIkNsYXNzTGlzdGluZyIsInN0dWRlbnRDbGFzcyIsInRlcm1zIiwiYXR0ZW5kYW5jZSIsImF0dGVuZGFuY2VYTUxPYmplY3QiLCJBdHRlbmRhbmNlIiwiVG90YWxBY3Rpdml0aWVzIiwiUGVyaW9kVG90YWwiLCJwZCIsImkiLCJ0b3RhbCIsImV4Y3VzZWQiLCJUb3RhbEV4Y3VzZWQiLCJ0YXJkaWVzIiwiVG90YWxUYXJkaWVzIiwidW5leGN1c2VkIiwiVG90YWxVbmV4Y3VzZWQiLCJhY3Rpdml0aWVzIiwidW5leGN1c2VkVGFyZGllcyIsIlRvdGFsVW5leGN1c2VkVGFyZGllcyIsInR5cGUiLCJzY2hvb2xOYW1lIiwiYWJzZW5jZXMiLCJBYnNlbmNlcyIsIkFic2VuY2UiLCJhYnNlbmNlIiwicmVhc29uIiwibm90ZSIsImRlc2NyaXB0aW9uIiwicGVyaW9kcyIsIlBlcmlvZHMiLCJQZXJpb2QiLCJvcmdZZWFyR3UiLCJwZXJpb2RJbmZvcyIsImdyYWRlYm9vayIsInJlcG9ydGluZ1BlcmlvZEluZGV4IiwiUmVwb3J0UGVyaW9kIiwiWE1MRmFjdG9yeSIsImVuY29kZUF0dHJpYnV0ZSIsInRvU3RyaW5nIiwiR3JhZGVib29rIiwiUmVwb3J0aW5nUGVyaW9kcyIsIkNvdXJzZXMiLCJDb3Vyc2UiLCJNYXJrcyIsIk1hcmsiLCJtYXJrIiwiY2FsY3VsYXRlZFNjb3JlIiwic3RyaW5nIiwicmF3Iiwid2VpZ2h0ZWRDYXRlZ29yaWVzIiwiQXNzaWdubWVudEdyYWRlQ2FsYyIsIndlaWdodGVkIiwiY2FsY3VsYXRlZE1hcmsiLCJ3ZWlnaHQiLCJldmFsdWF0ZWQiLCJzdGFuZGFyZCIsInBvaW50cyIsImN1cnJlbnQiLCJwb3NzaWJsZSIsImFzc2lnbm1lbnRzIiwiQXNzaWdubWVudHMiLCJBc3NpZ25tZW50IiwiYXNzaWdubWVudCIsImdyYWRlYm9va0lkIiwiZGVjb2RlVVJJIiwiZHVlIiwic2NvcmUiLCJ2YWx1ZSIsIm5vdGVzIiwidGVhY2hlcklkIiwiaGFzRHJvcGJveCIsIkpTT04iLCJzdHVkZW50SWQiLCJkcm9wYm94RGF0ZSIsInJlc291cmNlcyIsIlJlc291cmNlcyIsIlJlc291cmNlIiwicnNyYyIsImZpbGVSc3JjIiwiUmVzb3VyY2VUeXBlIiwiRklMRSIsImZpbGUiLCJ1cmkiLCJyZXNvdXJjZSIsImlkIiwidXJsUnNyYyIsIlVSTCIsInBhdGgiLCJ0aXRsZSIsIm1hcmtzIiwicmVwb3J0aW5nUGVyaW9kIiwiZmluZCIsIngiLCJSZXBvcnRpbmdQZXJpb2QiLCJhdmFpbGFibGUiLCJjb3Vyc2VzIiwibWVzc2FnZXMiLCJQWFBNZXNzYWdlc0RhdGEiLCJNZXNzYWdlTGlzdGluZ3MiLCJNZXNzYWdlTGlzdGluZyIsIm1lc3NhZ2UiLCJNZXNzYWdlIiwic3R1ZGVudEluZm8iLCJ4bWxPYmplY3REYXRhIiwic3R1ZGVudCIsIlN0dWRlbnRJbmZvIiwiRm9ybWF0dGVkTmFtZSIsImxhc3ROYW1lIiwiTGFzdE5hbWVHb2VzQnkiLCJuaWNrbmFtZSIsIk5pY2tOYW1lIiwiYmlydGhEYXRlIiwiQmlydGhEYXRlIiwidHJhY2siLCJvcHRpb25hbCIsIlRyYWNrIiwiQWRkcmVzcyIsInBob3RvIiwiUGhvdG8iLCJjb3Vuc2Vsb3IiLCJDb3Vuc2Vsb3JOYW1lIiwiQ291bnNlbG9yRW1haWwiLCJDb3Vuc2Vsb3JTdGFmZkdVIiwidW5kZWZpbmVkIiwiY3VycmVudFNjaG9vbCIsIkN1cnJlbnRTY2hvb2wiLCJkZW50aXN0IiwiRGVudGlzdCIsIm9mZmljZSIsInBoeXNpY2lhbiIsIlBoeXNpY2lhbiIsImhvc3BpdGFsIiwiUGVybUlEIiwiT3JnWWVhckdVIiwiUGhvbmUiLCJFTWFpbCIsImVtZXJnZW5jeUNvbnRhY3RzIiwiRW1lcmdlbmN5Q29udGFjdHMiLCJFbWVyZ2VuY3lDb250YWN0IiwiY29udGFjdCIsImhvbWUiLCJtb2JpbGUiLCJvdGhlciIsIndvcmsiLCJyZWxhdGlvbnNoaXAiLCJnZW5kZXIiLCJHZW5kZXIiLCJncmFkZSIsIkdyYWRlIiwibG9ja2VySW5mb1JlY29yZHMiLCJMb2NrZXJJbmZvUmVjb3JkcyIsImhvbWVMYW5ndWFnZSIsIkhvbWVMYW5ndWFnZSIsImhvbWVSb29tIiwiSG9tZVJvb20iLCJob21lUm9vbVRlYWNoZXIiLCJIb21lUm9vbVRjaEVNYWlsIiwiSG9tZVJvb21UY2giLCJIb21lUm9vbVRjaFN0YWZmR1UiLCJhZGRpdGlvbmFsSW5mbyIsIlVzZXJEZWZpbmVkR3JvdXBCb3hlcyIsIlVzZXJEZWZpbmVkR3JvdXBCb3giLCJkZWZpbmVkQm94IiwidmNJZCIsIml0ZW1zIiwiVXNlckRlZmluZWRJdGVtcyIsIlVzZXJEZWZpbmVkSXRlbSIsIml0ZW0iLCJzb3VyY2UiLCJlbGVtZW50Iiwib2JqZWN0IiwiZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbCIsIlJlcXVlc3REYXRlIiwidG9JU09TdHJpbmciLCJjYWxlbmRhciIsIm9wdGlvbnMiLCJkZWZhdWx0T3B0aW9ucyIsImNvbmN1cnJlbmN5IiwiY2FsIiwiY2FjaGUiLCJtZW1vIiwic2Nob29sRW5kRGF0ZSIsImludGVydmFsIiwiQ2FsZW5kYXJMaXN0aW5nIiwic2Nob29sU3RhcnREYXRlIiwibW9udGhzV2l0aGluU2Nob29sWWVhciIsImVhY2hNb250aE9mSW50ZXJ2YWwiLCJnZXRBbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyIiwiYWxsIiwiYXN5bmNQb29sQWxsIiwiZXZlbnRzIiwiYWxsRXZlbnRzIiwicmVkdWNlIiwicHJldiIsInNjaG9vbERhdGUiLCJvdXRwdXRSYW5nZSIsInJlc3QiLCJFdmVudExpc3RzIiwiRXZlbnRMaXN0IiwiZXZlbnQiLCJFdmVudFR5cGUiLCJBU1NJR05NRU5UIiwiYXNzaWdubWVudEV2ZW50IiwiYWRkTGlua0RhdGEiLCJhZ3UiLCJkZ3UiLCJsaW5rIiwic3RhcnRUaW1lIiwidmlld1R5cGUiLCJIT0xJREFZIiwiUkVHVUxBUiIsInJlZ3VsYXJFdmVudCIsIl8iLCJ1bmlxQnkiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvU3R1ZGVudFZ1ZS9DbGllbnQvQ2xpZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMsIFBhcnNlZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XG5pbXBvcnQgeyBBZGRpdGlvbmFsSW5mbywgQWRkaXRpb25hbEluZm9JdGVtLCBDbGFzc1NjaGVkdWxlSW5mbywgU2Nob29sSW5mbywgU3R1ZGVudEluZm8gfSBmcm9tICcuL0NsaWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCB7IFN0dWRlbnRJbmZvWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TdHVkZW50SW5mbyc7XG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuLi9NZXNzYWdlL01lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZVhNTE9iamVjdCB9IGZyb20gJy4uL01lc3NhZ2UvTWVzc2FnZS54bWwnO1xuaW1wb3J0IHsgQXNzaWdubWVudEV2ZW50WE1MT2JqZWN0LCBDYWxlbmRhclhNTE9iamVjdCwgUmVndWxhckV2ZW50WE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9DYWxlbmRhcic7XG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnQsIENhbGVuZGFyLCBDYWxlbmRhck9wdGlvbnMsIEV2ZW50LCBIb2xpZGF5RXZlbnQsIFJlZ3VsYXJFdmVudCB9IGZyb20gJy4vSW50ZXJmYWNlcy9DYWxlbmRhcic7XG5pbXBvcnQgeyBlYWNoTW9udGhPZkludGVydmFsLCBwYXJzZSB9IGZyb20gJ2RhdGUtZm5zJztcbmltcG9ydCB7IEZpbGVSZXNvdXJjZVhNTE9iamVjdCwgR3JhZGVib29rWE1MT2JqZWN0LCBVUkxSZXNvdXJjZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvR3JhZGVib29rJztcbmltcG9ydCB7IEF0dGVuZGFuY2VYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0F0dGVuZGFuY2UnO1xuaW1wb3J0IEV2ZW50VHlwZSBmcm9tICcuLi8uLi9Db25zdGFudHMvRXZlbnRUeXBlJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBBc3NpZ25tZW50LCBGaWxlUmVzb3VyY2UsIEdyYWRlYm9vaywgTWFyaywgVVJMUmVzb3VyY2UsIFdlaWdodGVkQ2F0ZWdvcnkgfSBmcm9tICcuL0ludGVyZmFjZXMvR3JhZGVib29rJztcbmltcG9ydCBSZXNvdXJjZVR5cGUgZnJvbSAnLi4vLi4vQ29uc3RhbnRzL1Jlc291cmNlVHlwZSc7XG5pbXBvcnQgeyBBYnNlbnRQZXJpb2QsIEF0dGVuZGFuY2UsIFBlcmlvZEluZm8gfSBmcm9tICcuL0ludGVyZmFjZXMvQXR0ZW5kYW5jZSc7XG5pbXBvcnQgeyBTY2hlZHVsZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU2NoZWR1bGUnO1xuaW1wb3J0IHsgU2NoZWR1bGUgfSBmcm9tICcuL0NsaWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCB7IFNjaG9vbEluZm9YTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1NjaG9vbEluZm8nO1xuaW1wb3J0IHsgUmVwb3J0Q2FyZHNYTUxPYmplY3QgfSBmcm9tICcuLi9SZXBvcnRDYXJkL1JlcG9ydENhcmQueG1sJztcbmltcG9ydCB7IERvY3VtZW50WE1MT2JqZWN0IH0gZnJvbSAnLi4vRG9jdW1lbnQvRG9jdW1lbnQueG1sJztcbmltcG9ydCBSZXBvcnRDYXJkIGZyb20gJy4uL1JlcG9ydENhcmQvUmVwb3J0Q2FyZCc7XG5pbXBvcnQgRG9jdW1lbnQgZnJvbSAnLi4vRG9jdW1lbnQvRG9jdW1lbnQnO1xuaW1wb3J0IFJlcXVlc3RFeGNlcHRpb24gZnJvbSAnLi4vUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcbmltcG9ydCBYTUxGYWN0b3J5IGZyb20gJy4uLy4uL3V0aWxzL1hNTEZhY3RvcnkvWE1MRmFjdG9yeSc7XG5pbXBvcnQgY2FjaGUgZnJvbSAnLi4vLi4vdXRpbHMvY2FjaGUvY2FjaGUnO1xuaW1wb3J0IHsgb3B0aW9uYWwsIGFzeW5jUG9vbEFsbCwgcGFyc2VEYXRlU3RyaW5nIH0gZnJvbSAnLi9DbGllbnQuaGVscGVycyc7XG5cbi8qKlxuICogVGhlIFN0dWRlbnRWVUUgQ2xpZW50IHRvIGFjY2VzcyB0aGUgQVBJXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIHtzb2FwLkNsaWVudH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IGV4dGVuZHMgc29hcC5DbGllbnQge1xuICBwcml2YXRlIGhvc3RVcmw6IHN0cmluZztcbiAgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsIGhvc3RVcmw6IHN0cmluZykge1xuICAgIHN1cGVyKGNyZWRlbnRpYWxzKTtcbiAgICB0aGlzLmhvc3RVcmwgPSBob3N0VXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlJ3MgdGhlIHVzZXIncyBjcmVkZW50aWFscy4gSXQgd2lsbCB0aHJvdyBhbiBlcnJvciBpZiBjcmVkZW50aWFscyBhcmUgaW5jb3JyZWN0XG4gICAqL1xuICBwdWJsaWMgdmFsaWRhdGVDcmVkZW50aWFscygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBzdXBlclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8UGFyc2VkUmVxdWVzdEVycm9yPih7IG1ldGhvZE5hbWU6ICdsb2dpbiB0ZXN0JywgdmFsaWRhdGVFcnJvcnM6IGZhbHNlIH0pXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmIChyZXNwb25zZS5SVF9FUlJPUlswXVsnQF9FUlJPUl9NRVNTQUdFJ11bMF0gPT09ICdsb2dpbiB0ZXN0IGlzIG5vdCBhIHZhbGlkIG1ldGhvZC4nKSByZXMoKTtcbiAgICAgICAgICBlbHNlIHJlaihuZXcgUmVxdWVzdEV4Y2VwdGlvbihyZXNwb25zZSkpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2gocmVqKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzdHVkZW50J3MgZG9jdW1lbnRzIGZyb20gc3luZXJneSBzZXJ2ZXJzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPERvY3VtZW50W10+fT4gUmV0dXJucyBhIGxpc3Qgb2Ygc3R1ZGVudCBkb2N1bWVudHNcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGNvbnN0IGRvY3VtZW50cyA9IGF3YWl0IGNsaWVudC5kb2N1bWVudHMoKTtcbiAgICogY29uc3QgZG9jdW1lbnQgPSBkb2N1bWVudHNbMF07XG4gICAqIGNvbnN0IGZpbGVzID0gYXdhaXQgZG9jdW1lbnQuZ2V0KCk7XG4gICAqIGNvbnN0IGJhc2U2NGNvbGxlY3Rpb24gPSBmaWxlcy5tYXAoKGZpbGUpID0+IGZpbGUuYmFzZTY0KTtcbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgZG9jdW1lbnRzKCk6IFByb21pc2U8RG9jdW1lbnRbXT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIHN1cGVyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxEb2N1bWVudFhNTE9iamVjdD4oe1xuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRTdHVkZW50RG9jdW1lbnRJbml0aWFsRGF0YScsXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XG4gICAgICAgICAgcmVzKFxuICAgICAgICAgICAgeG1sT2JqZWN0WydTdHVkZW50RG9jdW1lbnRzJ11bMF0uU3R1ZGVudERvY3VtZW50RGF0YXNbMF0uU3R1ZGVudERvY3VtZW50RGF0YS5tYXAoXG4gICAgICAgICAgICAgICh4bWwpID0+IG5ldyBEb2N1bWVudCh4bWwsIHN1cGVyLmNyZWRlbnRpYWxzKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWopO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIHJlcG9ydCBjYXJkc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxSZXBvcnRDYXJkW10+fSBSZXR1cm5zIGEgbGlzdCBvZiByZXBvcnQgY2FyZHMgdGhhdCBjYW4gZmV0Y2ggYSBmaWxlXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBjb25zdCByZXBvcnRDYXJkcyA9IGF3YWl0IGNsaWVudC5yZXBvcnRDYXJkcygpO1xuICAgKiBjb25zdCBmaWxlcyA9IGF3YWl0IFByb21pc2UuYWxsKHJlcG9ydENhcmRzLm1hcCgoY2FyZCkgPT4gY2FyZC5nZXQoKSkpO1xuICAgKiBjb25zdCBiYXNlNjRhcnIgPSBmaWxlcy5tYXAoKGZpbGUpID0+IGZpbGUuYmFzZTY0KTsgLy8gW1wiSlZCRVJpMC4uLlwiLCBcImRVSW9hMS4uLlwiLCAuLi5dO1xuICAgKiBgYGBcbiAgICovXG4gIHB1YmxpYyByZXBvcnRDYXJkcygpOiBQcm9taXNlPFJlcG9ydENhcmRbXT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIHN1cGVyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxSZXBvcnRDYXJkc1hNTE9iamVjdD4oe1xuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRSZXBvcnRDYXJkSW5pdGlhbERhdGEnLFxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xuICAgICAgICAgIHJlcyhcbiAgICAgICAgICAgIHhtbE9iamVjdC5SQ1JlcG9ydGluZ1BlcmlvZERhdGFbMF0uUkNSZXBvcnRpbmdQZXJpb2RzWzBdLlJDUmVwb3J0aW5nUGVyaW9kLm1hcChcbiAgICAgICAgICAgICAgKHhtbCkgPT4gbmV3IFJlcG9ydENhcmQoeG1sLCBzdXBlci5jcmVkZW50aWFscylcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2gocmVqKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzdHVkZW50J3Mgc2Nob29sJ3MgaW5mb3JtYXRpb25cbiAgICogQHJldHVybnMge1Byb21pc2U8U2Nob29sSW5mbz59IFJldHVybnMgdGhlIGluZm9ybWF0aW9uIG9mIHRoZSBzdHVkZW50J3Mgc2Nob29sXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBhd2FpdCBjbGllbnQuc2Nob29sSW5mbygpO1xuICAgKlxuICAgKiBjbGllbnQuc2Nob29sSW5mbygpLnRoZW4oKHNjaG9vbEluZm8pID0+IHtcbiAgICogIGNvbnNvbGUubG9nKF8udW5pcShzY2hvb2xJbmZvLnN0YWZmLm1hcCgoc3RhZmYpID0+IHN0YWZmLm5hbWUpKSk7IC8vIExpc3QgYWxsIHN0YWZmIHBvc2l0aW9ucyB1c2luZyBsb2Rhc2hcbiAgICogfSlcbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgc2Nob29sSW5mbygpOiBQcm9taXNlPFNjaG9vbEluZm8+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBzdXBlclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8U2Nob29sSW5mb1hNTE9iamVjdD4oe1xuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50U2Nob29sSW5mbycsXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJRDogMCB9LFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoeyBTdHVkZW50U2Nob29sSW5mb0xpc3Rpbmc6IFt4bWxPYmplY3RdIH0pID0+IHtcbiAgICAgICAgICByZXMoe1xuICAgICAgICAgICAgc2Nob29sOiB7XG4gICAgICAgICAgICAgIGFkZHJlc3M6IHhtbE9iamVjdFsnQF9TY2hvb2xBZGRyZXNzJ11bMF0sXG4gICAgICAgICAgICAgIGFkZHJlc3NBbHQ6IHhtbE9iamVjdFsnQF9TY2hvb2xBZGRyZXNzMiddWzBdLFxuICAgICAgICAgICAgICBjaXR5OiB4bWxPYmplY3RbJ0BfU2Nob29sQ2l0eSddWzBdLFxuICAgICAgICAgICAgICB6aXBDb2RlOiB4bWxPYmplY3RbJ0BfU2Nob29sWmlwJ11bMF0sXG4gICAgICAgICAgICAgIHBob25lOiB4bWxPYmplY3RbJ0BfUGhvbmUnXVswXSxcbiAgICAgICAgICAgICAgYWx0UGhvbmU6IHhtbE9iamVjdFsnQF9QaG9uZTInXVswXSxcbiAgICAgICAgICAgICAgcHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0WydAX1ByaW5jaXBhbCddWzBdLFxuICAgICAgICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsRW1haWwnXVswXSxcbiAgICAgICAgICAgICAgICBzdGFmZkd1OiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsR3UnXVswXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdGFmZjogeG1sT2JqZWN0LlN0YWZmTGlzdHNbMF0uU3RhZmZMaXN0Lm1hcCgoc3RhZmYpID0+ICh7XG4gICAgICAgICAgICAgIG5hbWU6IHN0YWZmWydAX05hbWUnXVswXSxcbiAgICAgICAgICAgICAgZW1haWw6IHN0YWZmWydAX0VNYWlsJ11bMF0sXG4gICAgICAgICAgICAgIHN0YWZmR3U6IHN0YWZmWydAX1N0YWZmR1UnXVswXSxcbiAgICAgICAgICAgICAgam9iVGl0bGU6IHN0YWZmWydAX1RpdGxlJ11bMF0sXG4gICAgICAgICAgICAgIGV4dG46IHN0YWZmWydAX0V4dG4nXVswXSxcbiAgICAgICAgICAgICAgcGhvbmU6IHN0YWZmWydAX1Bob25lJ11bMF0sXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWopO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHNjaGVkdWxlIG9mIHRoZSBzdHVkZW50XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0ZXJtSW5kZXggVGhlIGluZGV4IG9mIHRoZSB0ZXJtLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTY2hlZHVsZT59IFJldHVybnMgdGhlIHNjaGVkdWxlIG9mIHRoZSBzdHVkZW50XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBhd2FpdCBzY2hlZHVsZSgwKSAvLyAtPiB7IHRlcm06IHsgaW5kZXg6IDAsIG5hbWU6ICcxc3QgUXRyIFByb2dyZXNzJyB9LCAuLi4gfVxuICAgKiBgYGBcbiAgICovXG4gIHB1YmxpYyBzY2hlZHVsZSh0ZXJtSW5kZXg/OiBudW1iZXIpOiBQcm9taXNlPFNjaGVkdWxlPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFNjaGVkdWxlWE1MT2JqZWN0Pih7XG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDbGFzc0xpc3QnLFxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIC4uLih0ZXJtSW5kZXggIT0gbnVsbCA/IHsgVGVybUluZGV4OiB0ZXJtSW5kZXggfSA6IHt9KSB9LFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XG4gICAgICAgICAgcmVzKHtcbiAgICAgICAgICAgIHRlcm06IHtcbiAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcih4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfVGVybUluZGV4J11bMF0pLFxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfVGVybUluZGV4TmFtZSddWzBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXG4gICAgICAgICAgICB0b2RheTpcbiAgICAgICAgICAgICAgdHlwZW9mIHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5Ub2RheVNjaGVkdWxlSW5mb0RhdGFbMF0uU2Nob29sSW5mb3NbMF0gIT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgPyB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVG9kYXlTY2hlZHVsZUluZm9EYXRhWzBdLlNjaG9vbEluZm9zWzBdLlNjaG9vbEluZm8ubWFwKFxuICAgICAgICAgICAgICAgICAgICAoc2Nob29sKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNjaG9vbFsnQF9TY2hvb2xOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgYmVsbFNjaGVkdWxlTmFtZTogc2Nob29sWydAX0JlbGxTY2hlZE5hbWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzOlxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHNjaG9vbC5DbGFzc2VzWzBdICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICA/IHNjaG9vbC5DbGFzc2VzWzBdLkNsYXNzSW5mby5tYXA8Q2xhc3NTY2hlZHVsZUluZm8+KChjb3Vyc2UpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihjb3Vyc2VbJ0BfUGVyaW9kJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ZW5kYW5jZUNvZGU6IGNvdXJzZS5BdHRlbmRhbmNlQ29kZVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHBhcnNlRGF0ZVN0cmluZyhjb3Vyc2VbJ0BfU3RhcnREYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IHBhcnNlRGF0ZVN0cmluZyhjb3Vyc2VbJ0BfRW5kRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfQ2xhc3NOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWN0aW9uR3U6IGNvdXJzZVsnQF9TZWN0aW9uR1UnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9UZWFjaGVyRW1haWwnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWxTdWJqZWN0OiBjb3Vyc2VbJ0BfRW1haWxTdWJqZWN0J11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9UZWFjaGVyTmFtZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGNvdXJzZVsnQF9UZWFjaGVyVVJMJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBjb3Vyc2VbJ0BfQ2xhc3NVUkwnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHBhcnNlKGNvdXJzZVsnQF9TdGFydFRpbWUnXVswXSwgJ2hoOm1tIGEnLCBEYXRlLm5vdygpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBwYXJzZShjb3Vyc2VbJ0BfRW5kVGltZSddWzBdLCAnaGg6bW0gYScsIERhdGUubm93KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb206IGNvdXJzZVsnQF9Sb29tTmFtZSddWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogW10sXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgICAgIGNsYXNzZXM6XG4gICAgICAgICAgICAgIHR5cGVvZiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uQ2xhc3NMaXN0c1swXSAhPT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICA/IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5DbGFzc0xpc3RzWzBdLkNsYXNzTGlzdGluZy5tYXAoKHN0dWRlbnRDbGFzcykgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc3R1ZGVudENsYXNzWydAX0NvdXJzZVRpdGxlJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKHN0dWRlbnRDbGFzc1snQF9QZXJpb2QnXVswXSksXG4gICAgICAgICAgICAgICAgICAgIHJvb206IHN0dWRlbnRDbGFzc1snQF9Sb29tTmFtZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICBzZWN0aW9uR3U6IHN0dWRlbnRDbGFzc1snQF9TZWN0aW9uR1UnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgdGVhY2hlcjoge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyRW1haWwnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBzdHVkZW50Q2xhc3NbJ0BfVGVhY2hlclN0YWZmR1UnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIDogW10sXG4gICAgICAgICAgICB0ZXJtczogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLlRlcm1MaXN0c1swXS5UZXJtTGlzdGluZy5tYXAoKHRlcm0pID0+ICh7XG4gICAgICAgICAgICAgIGRhdGU6IHtcbiAgICAgICAgICAgICAgICBzdGFydDogcGFyc2VEYXRlU3RyaW5nKHRlcm1bJ0BfQmVnaW5EYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgIGVuZDogcGFyc2VEYXRlU3RyaW5nKHRlcm1bJ0BfRW5kRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcih0ZXJtWydAX1Rlcm1JbmRleCddWzBdKSxcbiAgICAgICAgICAgICAgbmFtZTogdGVybVsnQF9UZXJtTmFtZSddWzBdLFxuICAgICAgICAgICAgICBzY2hvb2xZZWFyVGVybUNvZGVHdTogdGVybVsnQF9TY2hvb2xZZWFyVHJtQ29kZUdVJ11bMF0sXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWopO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGF0dGVuZGFuY2Ugb2YgdGhlIHN0dWRlbnRcbiAgICogQHJldHVybnMge1Byb21pc2U8QXR0ZW5kYW5jZT59IFJldHVybnMgYW4gQXR0ZW5kYW5jZSBvYmplY3RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGNsaWVudC5hdHRlbmRhbmNlKClcbiAgICogIC50aGVuKGNvbnNvbGUubG9nKTsgLy8gLT4geyB0eXBlOiAnUGVyaW9kJywgcGVyaW9kOiB7Li4ufSwgc2Nob29sTmFtZTogJ1VuaXZlcnNpdHkgSGlnaCBTY2hvb2wnLCBhYnNlbmNlczogWy4uLl0sIHBlcmlvZEluZm9zOiBbLi4uXSB9XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIGF0dGVuZGFuY2UoKTogUHJvbWlzZTxBdHRlbmRhbmNlPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PEF0dGVuZGFuY2VYTUxPYmplY3Q+KHtcbiAgICAgICAgICBtZXRob2ROYW1lOiAnQXR0ZW5kYW5jZScsXG4gICAgICAgICAgcGFyYW1TdHI6IHtcbiAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKGF0dGVuZGFuY2VYTUxPYmplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB4bWxPYmplY3QgPSBhdHRlbmRhbmNlWE1MT2JqZWN0LkF0dGVuZGFuY2VbMF07XG5cbiAgICAgICAgICByZXMoe1xuICAgICAgICAgICAgdHlwZTogeG1sT2JqZWN0WydAX1R5cGUnXVswXSxcbiAgICAgICAgICAgIHBlcmlvZDoge1xuICAgICAgICAgICAgICB0b3RhbDogTnVtYmVyKHhtbE9iamVjdFsnQF9QZXJpb2RDb3VudCddWzBdKSxcbiAgICAgICAgICAgICAgc3RhcnQ6IE51bWJlcih4bWxPYmplY3RbJ0BfU3RhcnRQZXJpb2QnXVswXSksXG4gICAgICAgICAgICAgIGVuZDogTnVtYmVyKHhtbE9iamVjdFsnQF9FbmRQZXJpb2QnXVswXSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2Nob29sTmFtZTogeG1sT2JqZWN0WydAX1NjaG9vbE5hbWUnXVswXSxcbiAgICAgICAgICAgIGFic2VuY2VzOiB4bWxPYmplY3QuQWJzZW5jZXNbMF0uQWJzZW5jZVxuICAgICAgICAgICAgICA/IHhtbE9iamVjdC5BYnNlbmNlc1swXS5BYnNlbmNlLm1hcCgoYWJzZW5jZSkgPT4gKHtcbiAgICAgICAgICAgICAgICAgIGRhdGU6IHBhcnNlRGF0ZVN0cmluZyhhYnNlbmNlWydAX0Fic2VuY2VEYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgcmVhc29uOiBhYnNlbmNlWydAX1JlYXNvbiddWzBdLFxuICAgICAgICAgICAgICAgICAgbm90ZTogYWJzZW5jZVsnQF9Ob3RlJ11bMF0sXG4gICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYWJzZW5jZVsnQF9Db2RlQWxsRGF5RGVzY3JpcHRpb24nXVswXSxcbiAgICAgICAgICAgICAgICAgIHBlcmlvZHM6IGFic2VuY2UuUGVyaW9kc1swXS5QZXJpb2QubWFwKFxuICAgICAgICAgICAgICAgICAgICAocGVyaW9kKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZXJpb2RbJ0BfTnVtYmVyJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcGVyaW9kWydAX05hbWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbjogcGVyaW9kWydAX1JlYXNvbiddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291cnNlOiBwZXJpb2RbJ0BfQ291cnNlJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFmZjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfU3RhZmYnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhZmZHdTogcGVyaW9kWydAX1N0YWZmR1UnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHBlcmlvZFsnQF9TdGFmZkVNYWlsJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JnWWVhckd1OiBwZXJpb2RbJ0BfT3JnWWVhckdVJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSBhcyBBYnNlbnRQZXJpb2QpXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgICAgcGVyaW9kSW5mb3M6IHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWwubWFwKChwZCwgaSkgPT4gKHtcbiAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIocGRbJ0BfTnVtYmVyJ11bMF0pLFxuICAgICAgICAgICAgICB0b3RhbDoge1xuICAgICAgICAgICAgICAgIGV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxFeGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxuICAgICAgICAgICAgICAgIHRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxuICAgICAgICAgICAgICAgIHVuZXhjdXNlZDogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbFVuZXhjdXNlZFswXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsQWN0aXZpdGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcbiAgICAgICAgICAgICAgICB1bmV4Y3VzZWRUYXJkaWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkVGFyZGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pKSBhcyBQZXJpb2RJbmZvW10sXG4gICAgICAgICAgfSBhcyBBdHRlbmRhbmNlKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZ3JhZGVib29rIG9mIHRoZSBzdHVkZW50XG4gICAqIEBwYXJhbSB7bnVtYmVyfSByZXBvcnRpbmdQZXJpb2RJbmRleCBUaGUgdGltZWZyYW1lIHRoYXQgdGhlIGdyYWRlYm9vayBzaG91bGQgcmV0dXJuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEdyYWRlYm9vaz59IFJldHVybnMgYSBHcmFkZWJvb2sgb2JqZWN0XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBjb25zdCBncmFkZWJvb2sgPSBhd2FpdCBjbGllbnQuZ3JhZGVib29rKCk7XG4gICAqIGNvbnNvbGUubG9nKGdyYWRlYm9vayk7IC8vIHsgZXJyb3I6ICcnLCB0eXBlOiAnVHJhZGl0aW9uYWwnLCByZXBvcnRpbmdQZXJpb2Q6IHsuLi59LCBjb3Vyc2VzOiBbLi4uXSB9O1xuICAgKlxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDApIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggMCBhcyBcIjFzdCBRdWFydGVyIFByb2dyZXNzXCJcbiAgICogYXdhaXQgY2xpZW50LmdyYWRlYm9vayg3KSAvLyBTb21lIHNjaG9vbHMgd2lsbCBoYXZlIFJlcG9ydGluZ1BlcmlvZEluZGV4IDcgYXMgXCI0dGggUXVhcnRlclwiXG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIGdyYWRlYm9vayhyZXBvcnRpbmdQZXJpb2RJbmRleD86IG51bWJlcik6IFByb21pc2U8R3JhZGVib29rPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PEdyYWRlYm9va1hNTE9iamVjdD4oXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWV0aG9kTmFtZTogJ0dyYWRlYm9vaycsXG4gICAgICAgICAgICBwYXJhbVN0cjoge1xuICAgICAgICAgICAgICBjaGlsZEludElkOiAwLFxuICAgICAgICAgICAgICAuLi4ocmVwb3J0aW5nUGVyaW9kSW5kZXggIT0gbnVsbCA/IHsgUmVwb3J0UGVyaW9kOiByZXBvcnRpbmdQZXJpb2RJbmRleCB9IDoge30pLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICh4bWwpID0+XG4gICAgICAgICAgICBuZXcgWE1MRmFjdG9yeSh4bWwpXG4gICAgICAgICAgICAgIC5lbmNvZGVBdHRyaWJ1dGUoJ01lYXN1cmVEZXNjcmlwdGlvbicsICdIYXNEcm9wQm94JylcbiAgICAgICAgICAgICAgLmVuY29kZUF0dHJpYnV0ZSgnTWVhc3VyZScsICdUeXBlJylcbiAgICAgICAgICAgICAgLnRvU3RyaW5nKClcbiAgICAgICAgKVxuICAgICAgICAudGhlbigoeG1sT2JqZWN0OiBHcmFkZWJvb2tYTUxPYmplY3QpID0+IHtcbiAgICAgICAgICByZXMoe1xuICAgICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXG4gICAgICAgICAgICB0eXBlOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX1R5cGUnXVswXSxcbiAgICAgICAgICAgIHJlcG9ydGluZ1BlcmlvZDoge1xuICAgICAgICAgICAgICBjdXJyZW50OiB7XG4gICAgICAgICAgICAgICAgaW5kZXg6XG4gICAgICAgICAgICAgICAgICByZXBvcnRpbmdQZXJpb2RJbmRleCA/P1xuICAgICAgICAgICAgICAgICAgTnVtYmVyKFxuICAgICAgICAgICAgICAgICAgICB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZHNbMF0uUmVwb3J0UGVyaW9kLmZpbmQoXG4gICAgICAgICAgICAgICAgICAgICAgKHgpID0+IHhbJ0BfR3JhZGVQZXJpb2QnXVswXSA9PT0geG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfR3JhZGVQZXJpb2QnXVswXVxuICAgICAgICAgICAgICAgICAgICApPy5bJ0BfSW5kZXgnXVswXVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBkYXRlOiB7XG4gICAgICAgICAgICAgICAgICBzdGFydDogcGFyc2VEYXRlU3RyaW5nKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX1N0YXJ0RGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgIGVuZDogcGFyc2VEYXRlU3RyaW5nKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0VuZERhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9HcmFkZVBlcmlvZCddWzBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBhdmFpbGFibGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QubWFwKChwZXJpb2QpID0+ICh7XG4gICAgICAgICAgICAgICAgZGF0ZTogeyBzdGFydDogcGFyc2VEYXRlU3RyaW5nKHBlcmlvZFsnQF9TdGFydERhdGUnXVswXSksIGVuZDogcGFyc2VEYXRlU3RyaW5nKHBlcmlvZFsnQF9FbmREYXRlJ11bMF0pIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogcGVyaW9kWydAX0dyYWRlUGVyaW9kJ11bMF0sXG4gICAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcihwZXJpb2RbJ0BfSW5kZXgnXVswXSksXG4gICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb3Vyc2VzOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLkNvdXJzZXNbMF0uQ291cnNlLm1hcCgoY291cnNlKSA9PiAoe1xuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihjb3Vyc2VbJ0BfUGVyaW9kJ11bMF0pLFxuICAgICAgICAgICAgICB0aXRsZTogY291cnNlWydAX1RpdGxlJ11bMF0sXG4gICAgICAgICAgICAgIHJvb206IGNvdXJzZVsnQF9Sb29tJ11bMF0sXG4gICAgICAgICAgICAgIHN0YWZmOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogY291cnNlWydAX1N0YWZmJ11bMF0sXG4gICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9TdGFmZkVNYWlsJ11bMF0sXG4gICAgICAgICAgICAgICAgc3RhZmZHdTogY291cnNlWydAX1N0YWZmR1UnXVswXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbWFya3M6IGNvdXJzZS5NYXJrc1swXS5NYXJrLm1hcCgobWFyaykgPT4gKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBtYXJrWydAX01hcmtOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgY2FsY3VsYXRlZFNjb3JlOiB7XG4gICAgICAgICAgICAgICAgICBzdHJpbmc6IG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlU3RyaW5nJ11bMF0sXG4gICAgICAgICAgICAgICAgICByYXc6IE51bWJlcihtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVJhdyddWzBdKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHdlaWdodGVkQ2F0ZWdvcmllczpcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IG1hcmtbJ0dyYWRlQ2FsY3VsYXRpb25TdW1tYXJ5J11bMF0uQXNzaWdubWVudEdyYWRlQ2FsYy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAod2VpZ2h0ZWQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogd2VpZ2h0ZWRbJ0BfVHlwZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRNYXJrOiB3ZWlnaHRlZFsnQF9DYWxjdWxhdGVkTWFyayddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZhbHVhdGVkOiB3ZWlnaHRlZFsnQF9XZWlnaHRlZFBjdCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmQ6IHdlaWdodGVkWydAX1dlaWdodCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBOdW1iZXIod2VpZ2h0ZWRbJ0BfUG9pbnRzJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libGU6IE51bWJlcih3ZWlnaHRlZFsnQF9Qb2ludHNQb3NzaWJsZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFdlaWdodGVkQ2F0ZWdvcnkpXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRzOlxuICAgICAgICAgICAgICAgICAgdHlwZW9mIG1hcmsuQXNzaWdubWVudHNbMF0gIT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgID8gKG1hcmsuQXNzaWdubWVudHNbMF0uQXNzaWdubWVudC5tYXAoKGFzc2lnbm1lbnQpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmFkZWJvb2tJZDogYXNzaWdubWVudFsnQF9HcmFkZWJvb2tJRCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGVjb2RlVVJJKGFzc2lnbm1lbnRbJ0BfTWVhc3VyZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFzc2lnbm1lbnRbJ0BfVHlwZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogcGFyc2VEYXRlU3RyaW5nKGFzc2lnbm1lbnRbJ0BfRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHVlOiBwYXJzZURhdGVTdHJpbmcoYXNzaWdubWVudFsnQF9EdWVEYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFzc2lnbm1lbnRbJ0BfU2NvcmVUeXBlJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBhc3NpZ25tZW50WydAX1Njb3JlJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzOiBhc3NpZ25tZW50WydAX1BvaW50cyddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXM6IGFzc2lnbm1lbnRbJ0BfTm90ZXMnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXJJZDogYXNzaWdubWVudFsnQF9UZWFjaGVySUQnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkZWNvZGVVUkkoYXNzaWdubWVudFsnQF9NZWFzdXJlRGVzY3JpcHRpb24nXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNEcm9wYm94OiBKU09OLnBhcnNlKGFzc2lnbm1lbnRbJ0BfSGFzRHJvcEJveCddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0dWRlbnRJZDogYXNzaWdubWVudFsnQF9TdHVkZW50SUQnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bib3hEYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBwYXJzZURhdGVTdHJpbmcoYXNzaWdubWVudFsnQF9Ecm9wU3RhcnREYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IHBhcnNlRGF0ZVN0cmluZyhhc3NpZ25tZW50WydAX0Ryb3BFbmREYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdLlJlc291cmNlLm1hcCgocnNyYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJzcmNbJ0BfVHlwZSddWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnRmlsZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVSc3JjID0gcnNyYyBhcyBGaWxlUmVzb3VyY2VYTUxPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBSZXNvdXJjZVR5cGUuRklMRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpbGVSc3JjWydAX0ZpbGVUeXBlJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZVJzcmNbJ0BfRmlsZU5hbWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmk6IHRoaXMuaG9zdFVybCArIGZpbGVSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogcGFyc2VEYXRlU3RyaW5nKGZpbGVSc3JjWydAX1Jlc291cmNlRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZmlsZVJzcmNbJ0BfUmVzb3VyY2VJRCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBGaWxlUmVzb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ1VSTCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybFJzcmMgPSByc3JjIGFzIFVSTFJlc291cmNlWE1MT2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmxSc3JjWydAX1VSTCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBSZXNvdXJjZVR5cGUuVVJMLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IHBhcnNlRGF0ZVN0cmluZyh1cmxSc3JjWydAX1Jlc291cmNlRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdXJsUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdXJsUnNyY1snQF9SZXNvdXJjZU5hbWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdXJsUnNyY1snQF9SZXNvdXJjZURlc2NyaXB0aW9uJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHVybFJzcmNbJ0BfU2VydmVyRmlsZU5hbWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgVVJMUmVzb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWooXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBUeXBlICR7cnNyY1snQF9UeXBlJ11bMF19IGRvZXMgbm90IGV4aXN0IGFzIGEgdHlwZS4gQWRkIGl0IHRvIHR5cGUgZGVjbGFyYXRpb25zLmBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pIGFzIChGaWxlUmVzb3VyY2UgfCBVUkxSZXNvdXJjZSlbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgIH0pKSBhcyBBc3NpZ25tZW50W10pXG4gICAgICAgICAgICAgICAgICAgIDogW10sXG4gICAgICAgICAgICAgIH0pKSBhcyBNYXJrW10sXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgfSBhcyBHcmFkZWJvb2spO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2gocmVqKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBsaXN0IG9mIG1lc3NhZ2VzIG9mIHRoZSBzdHVkZW50XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE1lc3NhZ2VbXT59IFJldHVybnMgYW4gYXJyYXkgb2YgbWVzc2FnZXMgb2YgdGhlIHN0dWRlbnRcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGF3YWl0IGNsaWVudC5tZXNzYWdlcygpOyAvLyAtPiBbeyBpZDogJ0U5NzJGMUJDLTk5QTAtNENEMC04RDE1LUIxODk2OEI0M0UwOCcsIHR5cGU6ICdTdHVkZW50QWN0aXZpdHknLCAuLi4gfSwgeyBpZDogJzg2RkRBMTFELTQyQzctNDI0OS1CMDAzLTk0QjE1RUIyQzhENCcsIHR5cGU6ICdTdHVkZW50QWN0aXZpdHknLCAuLi4gfV1cbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgbWVzc2FnZXMoKTogUHJvbWlzZTxNZXNzYWdlW10+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBzdXBlclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8TWVzc2FnZVhNTE9iamVjdD4oXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFBYUE1lc3NhZ2VzJyxcbiAgICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICh4bWwpID0+IG5ldyBYTUxGYWN0b3J5KHhtbCkuZW5jb2RlQXR0cmlidXRlKCdDb250ZW50JywgJ1JlYWQnKS50b1N0cmluZygpXG4gICAgICAgIClcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xuICAgICAgICAgIHJlcyhcbiAgICAgICAgICAgIHhtbE9iamVjdC5QWFBNZXNzYWdlc0RhdGFbMF0uTWVzc2FnZUxpc3RpbmdzWzBdLk1lc3NhZ2VMaXN0aW5nLm1hcChcbiAgICAgICAgICAgICAgKG1lc3NhZ2UpID0+IG5ldyBNZXNzYWdlKG1lc3NhZ2UsIHN1cGVyLmNyZWRlbnRpYWxzLCB0aGlzLmhvc3RVcmwpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW5mbyBvZiBhIHN0dWRlbnRcbiAgICogQHJldHVybnMge1Byb21pc2U8U3R1ZGVudEluZm8+fSBTdHVkZW50SW5mbyBvYmplY3RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIHN0dWRlbnRJbmZvKCkudGhlbihjb25zb2xlLmxvZykgLy8gLT4geyBzdHVkZW50OiB7IG5hbWU6ICdFdmFuIERhdmlzJywgbmlja25hbWU6ICcnLCBsYXN0TmFtZTogJ0RhdmlzJyB9LCAuLi59XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIHN0dWRlbnRJbmZvKCk6IFByb21pc2U8U3R1ZGVudEluZm8+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8U3R1ZGVudEluZm8+KChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFN0dWRlbnRJbmZvWE1MT2JqZWN0Pih7XG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRJbmZvJyxcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3REYXRhKSA9PiB7XG4gICAgICAgICAgcmVzKHtcbiAgICAgICAgICAgIHN0dWRlbnQ6IHtcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Gb3JtYXR0ZWROYW1lWzBdLFxuICAgICAgICAgICAgICBsYXN0TmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5MYXN0TmFtZUdvZXNCeVswXSxcbiAgICAgICAgICAgICAgbmlja25hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uTmlja05hbWVbMF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmlydGhEYXRlOiBwYXJzZURhdGVTdHJpbmcoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5CaXJ0aERhdGVbMF0pLFxuICAgICAgICAgICAgdHJhY2s6IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uVHJhY2spLFxuICAgICAgICAgICAgYWRkcmVzczogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzKSxcbiAgICAgICAgICAgIHBob3RvOiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBob3RvKSxcbiAgICAgICAgICAgIGNvdW5zZWxvcjpcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Db3Vuc2Vsb3JOYW1lICYmXG4gICAgICAgICAgICAgIHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yRW1haWwgJiZcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Db3Vuc2Vsb3JTdGFmZkdVXG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yTmFtZVswXSxcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yRW1haWxbMF0sXG4gICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yU3RhZmZHVVswXSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGN1cnJlbnRTY2hvb2w6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ3VycmVudFNjaG9vbFswXSxcbiAgICAgICAgICAgIGRlbnRpc3Q6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRGVudGlzdFxuICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRGVudGlzdFswXVsnQF9OYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5EZW50aXN0WzBdWydAX1Bob25lJ11bMF0sXG4gICAgICAgICAgICAgICAgICBleHRuOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkRlbnRpc3RbMF1bJ0BfRXh0biddWzBdLFxuICAgICAgICAgICAgICAgICAgb2ZmaWNlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkRlbnRpc3RbMF1bJ0BfT2ZmaWNlJ11bMF0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBoeXNpY2lhbjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaHlzaWNpYW5cbiAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBoeXNpY2lhblswXVsnQF9OYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaHlzaWNpYW5bMF1bJ0BfUGhvbmUnXVswXSxcbiAgICAgICAgICAgICAgICAgIGV4dG46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGh5c2ljaWFuWzBdWydAX0V4dG4nXVswXSxcbiAgICAgICAgICAgICAgICAgIGhvc3BpdGFsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBoeXNpY2lhblswXVsnQF9Ib3NwaXRhbCddWzBdLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBpZDogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QZXJtSUQpLFxuICAgICAgICAgICAgb3JnWWVhckd1OiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLk9yZ1llYXJHVSksXG4gICAgICAgICAgICBwaG9uZTogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaG9uZSksXG4gICAgICAgICAgICBlbWFpbDogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5FTWFpbCksXG4gICAgICAgICAgICBlbWVyZ2VuY3lDb250YWN0czogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5FbWVyZ2VuY3lDb250YWN0c1xuICAgICAgICAgICAgICA/IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRW1lcmdlbmN5Q29udGFjdHNbMF0uRW1lcmdlbmN5Q29udGFjdC5tYXAoKGNvbnRhY3QpID0+ICh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBvcHRpb25hbChjb250YWN0WydAX05hbWUnXSksXG4gICAgICAgICAgICAgICAgICBwaG9uZToge1xuICAgICAgICAgICAgICAgICAgICBob21lOiBvcHRpb25hbChjb250YWN0WydAX0hvbWVQaG9uZSddKSxcbiAgICAgICAgICAgICAgICAgICAgbW9iaWxlOiBvcHRpb25hbChjb250YWN0WydAX01vYmlsZVBob25lJ10pLFxuICAgICAgICAgICAgICAgICAgICBvdGhlcjogb3B0aW9uYWwoY29udGFjdFsnQF9PdGhlclBob25lJ10pLFxuICAgICAgICAgICAgICAgICAgICB3b3JrOiBvcHRpb25hbChjb250YWN0WydAX1dvcmtQaG9uZSddKSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IG9wdGlvbmFsKGNvbnRhY3RbJ0BfUmVsYXRpb25zaGlwJ10pLFxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgICAgZ2VuZGVyOiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkdlbmRlciksXG4gICAgICAgICAgICBncmFkZTogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HcmFkZSksXG4gICAgICAgICAgICBsb2NrZXJJbmZvUmVjb3Jkczogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Mb2NrZXJJbmZvUmVjb3JkcyksXG4gICAgICAgICAgICBob21lTGFuZ3VhZ2U6IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uSG9tZUxhbmd1YWdlKSxcbiAgICAgICAgICAgIGhvbWVSb29tOiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkhvbWVSb29tKSxcbiAgICAgICAgICAgIGhvbWVSb29tVGVhY2hlcjoge1xuICAgICAgICAgICAgICBlbWFpbDogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Ib21lUm9vbVRjaEVNYWlsKSxcbiAgICAgICAgICAgICAgbmFtZTogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Ib21lUm9vbVRjaCksXG4gICAgICAgICAgICAgIHN0YWZmR3U6IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uSG9tZVJvb21UY2hTdGFmZkdVKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRpdGlvbmFsSW5mbzogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94ZXNbMF0uVXNlckRlZmluZWRHcm91cEJveFxuICAgICAgICAgICAgICA/ICh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3hlc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94Lm1hcCgoZGVmaW5lZEJveCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgIGlkOiBvcHRpb25hbChkZWZpbmVkQm94WydAX0dyb3VwQm94SUQnXSksIC8vIHN0cmluZyB8IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgdHlwZTogZGVmaW5lZEJveFsnQF9Hcm91cEJveExhYmVsJ11bMF0sIC8vIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgdmNJZDogb3B0aW9uYWwoZGVmaW5lZEJveFsnQF9WQ0lEJ10pLCAvLyBzdHJpbmcgfCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgIGl0ZW1zOiBkZWZpbmVkQm94LlVzZXJEZWZpbmVkSXRlbXNbMF0uVXNlckRlZmluZWRJdGVtLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogaXRlbVsnQF9Tb3VyY2VFbGVtZW50J11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBpdGVtWydAX1NvdXJjZU9iamVjdCddWzBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2Y0lkOiBpdGVtWydAX1ZDSUQnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1bJ0BfVmFsdWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogaXRlbVsnQF9JdGVtVHlwZSddWzBdLFxuICAgICAgICAgICAgICAgICAgfSkpIGFzIEFkZGl0aW9uYWxJbmZvSXRlbVtdLFxuICAgICAgICAgICAgICAgIH0pKSBhcyBBZGRpdGlvbmFsSW5mb1tdKVxuICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgIH0gYXMgU3R1ZGVudEluZm8pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2gocmVqKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlOiBEYXRlKSB7XG4gICAgcmV0dXJuIHN1cGVyLnByb2Nlc3NSZXF1ZXN0PENhbGVuZGFyWE1MT2JqZWN0PihcbiAgICAgIHtcbiAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDYWxlbmRhcicsXG4gICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIFJlcXVlc3REYXRlOiBkYXRlLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgIH0sXG4gICAgICAoeG1sKSA9PiBuZXcgWE1MRmFjdG9yeSh4bWwpLmVuY29kZUF0dHJpYnV0ZSgnVGl0bGUnLCAnSWNvbicpLnRvU3RyaW5nKClcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7Q2FsZW5kYXJPcHRpb25zfSBvcHRpb25zIE9wdGlvbnMgdG8gcHJvdmlkZSBmb3IgY2FsZW5kYXIgbWV0aG9kLiBBbiBpbnRlcnZhbCBpcyByZXF1aXJlZC5cbiAgICogQHJldHVybnMge1Byb21pc2U8Q2FsZW5kYXI+fSBSZXR1cm5zIGEgQ2FsZW5kYXIgb2JqZWN0XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBjbGllbnQuY2FsZW5kYXIoeyBpbnRlcnZhbDogeyBzdGFydDogcGFyc2VEYXRlKCc1LzEvMjAyMicpLCBlbmQ6IHBhcnNlRGF0ZSgnOC8xLzIwMjEnKSB9LCBjb25jdXJyZW5jeTogbnVsbCB9KTsgLy8gLT4gTGltaXRsZXNzIGNvbmN1cnJlbmN5IChub3QgcmVjb21tZW5kZWQpXG4gICAqXG4gICAqIGNvbnN0IGNhbGVuZGFyID0gYXdhaXQgY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgLi4uIH19KTtcbiAgICogY29uc29sZS5sb2coY2FsZW5kYXIpOyAvLyAtPiB7IHNjaG9vbERhdGU6IHsuLi59LCBvdXRwdXRSYW5nZTogey4uLn0sIGV2ZW50czogWy4uLl0gfVxuICAgKiBgYGBcbiAgICovXG4gIHB1YmxpYyBhc3luYyBjYWxlbmRhcihvcHRpb25zOiBDYWxlbmRhck9wdGlvbnMgPSB7fSk6IFByb21pc2U8Q2FsZW5kYXI+IHtcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogQ2FsZW5kYXJPcHRpb25zID0ge1xuICAgICAgY29uY3VycmVuY3k6IDcsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG4gICAgY29uc3QgY2FsID0gYXdhaXQgY2FjaGUubWVtbygoKSA9PiB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwobmV3IERhdGUoKSkpO1xuICAgIGNvbnN0IHNjaG9vbEVuZERhdGU6IERhdGUgfCBudW1iZXIgPVxuICAgICAgb3B0aW9ucy5pbnRlcnZhbD8uZW5kID8/IHBhcnNlRGF0ZVN0cmluZyhjYWwuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEVuZERhdGUnXVswXSk7XG4gICAgY29uc3Qgc2Nob29sU3RhcnREYXRlOiBEYXRlIHwgbnVtYmVyID1cbiAgICAgIG9wdGlvbnMuaW50ZXJ2YWw/LnN0YXJ0ID8/IHBhcnNlRGF0ZVN0cmluZyhjYWwuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBjb25zdCBtb250aHNXaXRoaW5TY2hvb2xZZWFyID0gZWFjaE1vbnRoT2ZJbnRlcnZhbCh7IHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsIGVuZDogc2Nob29sRW5kRGF0ZSB9KTtcbiAgICAgIGNvbnN0IGdldEFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIgPSAoKTogUHJvbWlzZTxDYWxlbmRhclhNTE9iamVjdFtdPiA9PlxuICAgICAgICBkZWZhdWx0T3B0aW9ucy5jb25jdXJyZW5jeSA9PSBudWxsXG4gICAgICAgICAgPyBQcm9taXNlLmFsbChtb250aHNXaXRoaW5TY2hvb2xZZWFyLm1hcCgoZGF0ZSkgPT4gdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpKSlcbiAgICAgICAgICA6IGFzeW5jUG9vbEFsbChkZWZhdWx0T3B0aW9ucy5jb25jdXJyZW5jeSwgbW9udGhzV2l0aGluU2Nob29sWWVhciwgKGRhdGUpID0+XG4gICAgICAgICAgICAgIHRoaXMuZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlKVxuICAgICAgICAgICAgKTtcbiAgICAgIGxldCBtZW1vOiBDYWxlbmRhciB8IG51bGwgPSBudWxsO1xuICAgICAgZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhcigpXG4gICAgICAgIC50aGVuKChldmVudHMpID0+IHtcbiAgICAgICAgICBjb25zdCBhbGxFdmVudHMgPSBldmVudHMucmVkdWNlKChwcmV2LCBldmVudHMpID0+IHtcbiAgICAgICAgICAgIGlmIChtZW1vID09IG51bGwpXG4gICAgICAgICAgICAgIG1lbW8gPSB7XG4gICAgICAgICAgICAgICAgc2Nob29sRGF0ZToge1xuICAgICAgICAgICAgICAgICAgc3RhcnQ6IHBhcnNlRGF0ZVN0cmluZyhldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgICBlbmQ6IHBhcnNlRGF0ZVN0cmluZyhldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEVuZERhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvdXRwdXRSYW5nZToge1xuICAgICAgICAgICAgICAgICAgc3RhcnQ6IHNjaG9vbFN0YXJ0RGF0ZSxcbiAgICAgICAgICAgICAgICAgIGVuZDogc2Nob29sRW5kRGF0ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV2ZW50czogW10sXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCByZXN0OiBDYWxlbmRhciA9IHtcbiAgICAgICAgICAgICAgLi4ubWVtbywgLy8gVGhpcyBpcyB0byBwcmV2ZW50IHJlLWluaXRpYWxpemluZyBEYXRlIG9iamVjdHMgaW4gb3JkZXIgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICBldmVudHM6IFtcbiAgICAgICAgICAgICAgICAuLi4ocHJldi5ldmVudHMgPyBwcmV2LmV2ZW50cyA6IFtdKSxcbiAgICAgICAgICAgICAgICAuLi4odHlwZW9mIGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF0uRXZlbnRMaXN0c1swXSAhPT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgID8gKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF0uRXZlbnRMaXN0c1swXS5FdmVudExpc3QubWFwKChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnRbJ0BfRGF5VHlwZSddWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5BU1NJR05NRU5UOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2lnbm1lbnRFdmVudCA9IGV2ZW50IGFzIEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZGVjb2RlVVJJKGFzc2lnbm1lbnRFdmVudFsnQF9UaXRsZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRMaW5rRGF0YTogYXNzaWdubWVudEV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfQUdVJ10gPyBhc3NpZ25tZW50RXZlbnRbJ0BfQUdVJ11bMF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogcGFyc2VEYXRlU3RyaW5nKGFzc2lnbm1lbnRFdmVudFsnQF9EYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRndTogYXNzaWdubWVudEV2ZW50WydAX0RHVSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGFzc2lnbm1lbnRFdmVudFsnQF9MaW5rJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBhc3NpZ25tZW50RXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLkFTU0lHTk1FTlQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld1R5cGU6IGFzc2lnbm1lbnRFdmVudFsnQF9WaWV3VHlwZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEFzc2lnbm1lbnRFdmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLkhPTElEQVk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZGVjb2RlVVJJKGV2ZW50WydAX1RpdGxlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEV2ZW50VHlwZS5IT0xJREFZLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogZXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogcGFyc2VEYXRlU3RyaW5nKGV2ZW50WydAX0RhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgSG9saWRheUV2ZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuUkVHVUxBUjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWd1bGFyRXZlbnQgPSBldmVudCBhcyBSZWd1bGFyRXZlbnRYTUxPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGRlY29kZVVSSShyZWd1bGFyRXZlbnRbJ0BfVGl0bGUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWd1OiByZWd1bGFyRXZlbnRbJ0BfQUdVJ10gPyByZWd1bGFyRXZlbnRbJ0BfQUdVJ11bMF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogcGFyc2VEYXRlU3RyaW5nKHJlZ3VsYXJFdmVudFsnQF9EYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiByZWd1bGFyRXZlbnRbJ0BfRXZ0RGVzY3JpcHRpb24nXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZWd1bGFyRXZlbnRbJ0BfRXZ0RGVzY3JpcHRpb24nXVswXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGd1OiByZWd1bGFyRXZlbnRbJ0BfREdVJ10gPyByZWd1bGFyRXZlbnRbJ0BfREdVJ11bMF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogcmVndWxhckV2ZW50WydAX0xpbmsnXSA/IHJlZ3VsYXJFdmVudFsnQF9MaW5rJ11bMF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiByZWd1bGFyRXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLlJFR1VMQVIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld1R5cGU6IHJlZ3VsYXJFdmVudFsnQF9WaWV3VHlwZSddID8gcmVndWxhckV2ZW50WydAX1ZpZXdUeXBlJ11bMF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddID8gcmVndWxhckV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUmVndWxhckV2ZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkgYXMgRXZlbnRbXSlcbiAgICAgICAgICAgICAgICAgIDogW10pLFxuICAgICAgICAgICAgICBdIGFzIEV2ZW50W10sXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgICB9LCB7fSBhcyBDYWxlbmRhcik7XG4gICAgICAgICAgcmVzKHsgLi4uYWxsRXZlbnRzLCBldmVudHM6IF8udW5pcUJ5KGFsbEV2ZW50cy5ldmVudHMsIChpdGVtKSA9PiBpdGVtLnRpdGxlKSB9IGFzIENhbGVuZGFyKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4g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