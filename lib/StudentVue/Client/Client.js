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
                start: new Date(term['@_BeginDate'][0]),
                end: new Date(term['@_EndDate'][0])
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
                      start: new Date(course['@_StartDate'][0]),
                      end: new Date(course['@_EndDate'][0])
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
                date: new Date(absence['@_AbsenceDate'][0]),
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
                start: new Date(period['@_StartDate'][0]),
                end: new Date(period['@_EndDate'][0])
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
                      start: new Date(assignment['@_Date'][0]),
                      due: new Date(assignment['@_DueDate'][0])
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
                      start: new Date(assignment['@_DropStartDate'][0]),
                      end: new Date(assignment['@_DropEndDate'][0])
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
                                date: new Date(fileRsrc['@_ResourceDate'][0]),
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
                                date: new Date(urlRsrc['@_ResourceDate'][0]),
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
                  start: new Date(xmlObject.Gradebook[0].ReportingPeriod[0]['@_StartDate'][0]),
                  end: new Date(xmlObject.Gradebook[0].ReportingPeriod[0]['@_EndDate'][0])
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
            birthDate: new Date(xmlObjectData.StudentInfo[0].BirthDate[0]),
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
     * client.calendar({ interval: { start: new Date('5/1/2022'), end: new Date('8/1/2021') }, concurrency: null }); // -> Limitless concurrency (not recommended)
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
      const schoolEndDate = options.interval?.end ?? new Date(cal.CalendarListing[0]['@_SchoolEndDate'][0]);
      const schoolStartDate = options.interval?.start ?? new Date(cal.CalendarListing[0]['@_SchoolBegDate'][0]);
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
                  start: new Date(events.CalendarListing[0]['@_SchoolBegDate'][0]),
                  end: new Date(events.CalendarListing[0]['@_SchoolEndDate'][0])
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
                        date: new Date(assignmentEvent['@_Date'][0]),
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
                        date: new Date(event['@_Date'][0])
                      };
                    }
                  case _EventType.default.REGULAR:
                    {
                      const regularEvent = event;
                      return {
                        title: decodeURI(regularEvent['@_Title'][0]),
                        agu: regularEvent['@_AGU'] ? regularEvent['@_AGU'][0] : undefined,
                        date: new Date(regularEvent['@_Date'][0]),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDbGllbnQiLCJzb2FwIiwiY29uc3RydWN0b3IiLCJjcmVkZW50aWFscyIsImhvc3RVcmwiLCJ2YWxpZGF0ZUNyZWRlbnRpYWxzIiwiUHJvbWlzZSIsInJlcyIsInJlaiIsInByb2Nlc3NSZXF1ZXN0IiwibWV0aG9kTmFtZSIsInZhbGlkYXRlRXJyb3JzIiwidGhlbiIsInJlc3BvbnNlIiwiUlRfRVJST1IiLCJSZXF1ZXN0RXhjZXB0aW9uIiwiY2F0Y2giLCJkb2N1bWVudHMiLCJwYXJhbVN0ciIsImNoaWxkSW50SWQiLCJ4bWxPYmplY3QiLCJTdHVkZW50RG9jdW1lbnREYXRhcyIsIlN0dWRlbnREb2N1bWVudERhdGEiLCJ4bWwiLCJEb2N1bWVudCIsInJlcG9ydENhcmRzIiwiUkNSZXBvcnRpbmdQZXJpb2REYXRhIiwiUkNSZXBvcnRpbmdQZXJpb2RzIiwiUkNSZXBvcnRpbmdQZXJpb2QiLCJSZXBvcnRDYXJkIiwic2Nob29sSW5mbyIsImNoaWxkSW50SUQiLCJTdHVkZW50U2Nob29sSW5mb0xpc3RpbmciLCJTdGFmZkxpc3RzIiwiU3RhZmZMaXN0Iiwic3RhZmYiLCJuYW1lIiwiZW1haWwiLCJzdGFmZkd1Iiwiam9iVGl0bGUiLCJleHRuIiwicGhvbmUiLCJzY2hvb2wiLCJhZGRyZXNzIiwiYWRkcmVzc0FsdCIsImNpdHkiLCJ6aXBDb2RlIiwiYWx0UGhvbmUiLCJwcmluY2lwYWwiLCJzY2hlZHVsZSIsInRlcm1JbmRleCIsIlRlcm1JbmRleCIsIlN0dWRlbnRDbGFzc1NjaGVkdWxlIiwiVGVybUxpc3RzIiwiVGVybUxpc3RpbmciLCJ0ZXJtIiwiZGF0ZSIsInN0YXJ0IiwiRGF0ZSIsImVuZCIsImluZGV4IiwiTnVtYmVyIiwic2Nob29sWWVhclRlcm1Db2RlR3UiLCJlcnJvciIsInRvZGF5IiwiVG9kYXlTY2hlZHVsZUluZm9EYXRhIiwiU2Nob29sSW5mb3MiLCJTY2hvb2xJbmZvIiwibWFwIiwiYmVsbFNjaGVkdWxlTmFtZSIsImNsYXNzZXMiLCJDbGFzc2VzIiwiQ2xhc3NJbmZvIiwiY291cnNlIiwicGVyaW9kIiwiYXR0ZW5kYW5jZUNvZGUiLCJBdHRlbmRhbmNlQ29kZSIsInNlY3Rpb25HdSIsInRlYWNoZXIiLCJlbWFpbFN1YmplY3QiLCJ1cmwiLCJ0aW1lIiwicGFyc2UiLCJub3ciLCJyb29tIiwiQ2xhc3NMaXN0cyIsIkNsYXNzTGlzdGluZyIsInN0dWRlbnRDbGFzcyIsInRlcm1zIiwiYXR0ZW5kYW5jZSIsImF0dGVuZGFuY2VYTUxPYmplY3QiLCJBdHRlbmRhbmNlIiwiVG90YWxBY3Rpdml0aWVzIiwiUGVyaW9kVG90YWwiLCJwZCIsImkiLCJ0b3RhbCIsImV4Y3VzZWQiLCJUb3RhbEV4Y3VzZWQiLCJ0YXJkaWVzIiwiVG90YWxUYXJkaWVzIiwidW5leGN1c2VkIiwiVG90YWxVbmV4Y3VzZWQiLCJhY3Rpdml0aWVzIiwidW5leGN1c2VkVGFyZGllcyIsIlRvdGFsVW5leGN1c2VkVGFyZGllcyIsInR5cGUiLCJzY2hvb2xOYW1lIiwiYWJzZW5jZXMiLCJBYnNlbmNlcyIsIkFic2VuY2UiLCJhYnNlbmNlIiwicmVhc29uIiwibm90ZSIsImRlc2NyaXB0aW9uIiwicGVyaW9kcyIsIlBlcmlvZHMiLCJQZXJpb2QiLCJvcmdZZWFyR3UiLCJwZXJpb2RJbmZvcyIsImdyYWRlYm9vayIsInJlcG9ydGluZ1BlcmlvZEluZGV4IiwiUmVwb3J0UGVyaW9kIiwiWE1MRmFjdG9yeSIsImVuY29kZUF0dHJpYnV0ZSIsInRvU3RyaW5nIiwiR3JhZGVib29rIiwiUmVwb3J0aW5nUGVyaW9kcyIsIkNvdXJzZXMiLCJDb3Vyc2UiLCJNYXJrcyIsIk1hcmsiLCJtYXJrIiwiY2FsY3VsYXRlZFNjb3JlIiwic3RyaW5nIiwicmF3Iiwid2VpZ2h0ZWRDYXRlZ29yaWVzIiwiQXNzaWdubWVudEdyYWRlQ2FsYyIsIndlaWdodGVkIiwiY2FsY3VsYXRlZE1hcmsiLCJ3ZWlnaHQiLCJldmFsdWF0ZWQiLCJzdGFuZGFyZCIsInBvaW50cyIsImN1cnJlbnQiLCJwb3NzaWJsZSIsImFzc2lnbm1lbnRzIiwiQXNzaWdubWVudHMiLCJBc3NpZ25tZW50IiwiYXNzaWdubWVudCIsImdyYWRlYm9va0lkIiwiZGVjb2RlVVJJIiwiZHVlIiwic2NvcmUiLCJ2YWx1ZSIsIm5vdGVzIiwidGVhY2hlcklkIiwiaGFzRHJvcGJveCIsIkpTT04iLCJzdHVkZW50SWQiLCJkcm9wYm94RGF0ZSIsInJlc291cmNlcyIsIlJlc291cmNlcyIsIlJlc291cmNlIiwicnNyYyIsImZpbGVSc3JjIiwiUmVzb3VyY2VUeXBlIiwiRklMRSIsImZpbGUiLCJ1cmkiLCJyZXNvdXJjZSIsImlkIiwidXJsUnNyYyIsIlVSTCIsInBhdGgiLCJ0aXRsZSIsIm1hcmtzIiwicmVwb3J0aW5nUGVyaW9kIiwiZmluZCIsIngiLCJSZXBvcnRpbmdQZXJpb2QiLCJhdmFpbGFibGUiLCJjb3Vyc2VzIiwibWVzc2FnZXMiLCJQWFBNZXNzYWdlc0RhdGEiLCJNZXNzYWdlTGlzdGluZ3MiLCJNZXNzYWdlTGlzdGluZyIsIm1lc3NhZ2UiLCJNZXNzYWdlIiwic3R1ZGVudEluZm8iLCJ4bWxPYmplY3REYXRhIiwic3R1ZGVudCIsIlN0dWRlbnRJbmZvIiwiRm9ybWF0dGVkTmFtZSIsImxhc3ROYW1lIiwiTGFzdE5hbWVHb2VzQnkiLCJuaWNrbmFtZSIsIk5pY2tOYW1lIiwiYmlydGhEYXRlIiwiQmlydGhEYXRlIiwidHJhY2siLCJvcHRpb25hbCIsIlRyYWNrIiwiQWRkcmVzcyIsInBob3RvIiwiUGhvdG8iLCJjb3Vuc2Vsb3IiLCJDb3Vuc2Vsb3JOYW1lIiwiQ291bnNlbG9yRW1haWwiLCJDb3Vuc2Vsb3JTdGFmZkdVIiwidW5kZWZpbmVkIiwiY3VycmVudFNjaG9vbCIsIkN1cnJlbnRTY2hvb2wiLCJkZW50aXN0IiwiRGVudGlzdCIsIm9mZmljZSIsInBoeXNpY2lhbiIsIlBoeXNpY2lhbiIsImhvc3BpdGFsIiwiUGVybUlEIiwiT3JnWWVhckdVIiwiUGhvbmUiLCJFTWFpbCIsImVtZXJnZW5jeUNvbnRhY3RzIiwiRW1lcmdlbmN5Q29udGFjdHMiLCJFbWVyZ2VuY3lDb250YWN0IiwiY29udGFjdCIsImhvbWUiLCJtb2JpbGUiLCJvdGhlciIsIndvcmsiLCJyZWxhdGlvbnNoaXAiLCJnZW5kZXIiLCJHZW5kZXIiLCJncmFkZSIsIkdyYWRlIiwibG9ja2VySW5mb1JlY29yZHMiLCJMb2NrZXJJbmZvUmVjb3JkcyIsImhvbWVMYW5ndWFnZSIsIkhvbWVMYW5ndWFnZSIsImhvbWVSb29tIiwiSG9tZVJvb20iLCJob21lUm9vbVRlYWNoZXIiLCJIb21lUm9vbVRjaEVNYWlsIiwiSG9tZVJvb21UY2giLCJIb21lUm9vbVRjaFN0YWZmR1UiLCJhZGRpdGlvbmFsSW5mbyIsIlVzZXJEZWZpbmVkR3JvdXBCb3hlcyIsIlVzZXJEZWZpbmVkR3JvdXBCb3giLCJkZWZpbmVkQm94IiwidmNJZCIsIml0ZW1zIiwiVXNlckRlZmluZWRJdGVtcyIsIlVzZXJEZWZpbmVkSXRlbSIsIml0ZW0iLCJzb3VyY2UiLCJlbGVtZW50Iiwib2JqZWN0IiwiZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbCIsIlJlcXVlc3REYXRlIiwidG9JU09TdHJpbmciLCJjYWxlbmRhciIsIm9wdGlvbnMiLCJkZWZhdWx0T3B0aW9ucyIsImNvbmN1cnJlbmN5IiwiY2FsIiwiY2FjaGUiLCJtZW1vIiwic2Nob29sRW5kRGF0ZSIsImludGVydmFsIiwiQ2FsZW5kYXJMaXN0aW5nIiwic2Nob29sU3RhcnREYXRlIiwibW9udGhzV2l0aGluU2Nob29sWWVhciIsImVhY2hNb250aE9mSW50ZXJ2YWwiLCJnZXRBbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyIiwiYWxsIiwiYXN5bmNQb29sQWxsIiwiZXZlbnRzIiwiYWxsRXZlbnRzIiwicmVkdWNlIiwicHJldiIsInNjaG9vbERhdGUiLCJvdXRwdXRSYW5nZSIsInJlc3QiLCJFdmVudExpc3RzIiwiRXZlbnRMaXN0IiwiZXZlbnQiLCJFdmVudFR5cGUiLCJBU1NJR05NRU5UIiwiYXNzaWdubWVudEV2ZW50IiwiYWRkTGlua0RhdGEiLCJhZ3UiLCJkZ3UiLCJsaW5rIiwic3RhcnRUaW1lIiwidmlld1R5cGUiLCJIT0xJREFZIiwiUkVHVUxBUiIsInJlZ3VsYXJFdmVudCIsIl8iLCJ1bmlxQnkiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvU3R1ZGVudFZ1ZS9DbGllbnQvQ2xpZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMsIFBhcnNlZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XG5pbXBvcnQgeyBBZGRpdGlvbmFsSW5mbywgQWRkaXRpb25hbEluZm9JdGVtLCBDbGFzc1NjaGVkdWxlSW5mbywgU2Nob29sSW5mbywgU3R1ZGVudEluZm8gfSBmcm9tICcuL0NsaWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCB7IFN0dWRlbnRJbmZvWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TdHVkZW50SW5mbyc7XG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuLi9NZXNzYWdlL01lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZVhNTE9iamVjdCB9IGZyb20gJy4uL01lc3NhZ2UvTWVzc2FnZS54bWwnO1xuaW1wb3J0IHsgQXNzaWdubWVudEV2ZW50WE1MT2JqZWN0LCBDYWxlbmRhclhNTE9iamVjdCwgUmVndWxhckV2ZW50WE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9DYWxlbmRhcic7XG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnQsIENhbGVuZGFyLCBDYWxlbmRhck9wdGlvbnMsIEV2ZW50LCBIb2xpZGF5RXZlbnQsIFJlZ3VsYXJFdmVudCB9IGZyb20gJy4vSW50ZXJmYWNlcy9DYWxlbmRhcic7XG5pbXBvcnQgeyBlYWNoTW9udGhPZkludGVydmFsLCBwYXJzZSB9IGZyb20gJ2RhdGUtZm5zJztcbmltcG9ydCB7IEZpbGVSZXNvdXJjZVhNTE9iamVjdCwgR3JhZGVib29rWE1MT2JqZWN0LCBVUkxSZXNvdXJjZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvR3JhZGVib29rJztcbmltcG9ydCB7IEF0dGVuZGFuY2VYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0F0dGVuZGFuY2UnO1xuaW1wb3J0IEV2ZW50VHlwZSBmcm9tICcuLi8uLi9Db25zdGFudHMvRXZlbnRUeXBlJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBBc3NpZ25tZW50LCBGaWxlUmVzb3VyY2UsIEdyYWRlYm9vaywgTWFyaywgVVJMUmVzb3VyY2UsIFdlaWdodGVkQ2F0ZWdvcnkgfSBmcm9tICcuL0ludGVyZmFjZXMvR3JhZGVib29rJztcbmltcG9ydCBSZXNvdXJjZVR5cGUgZnJvbSAnLi4vLi4vQ29uc3RhbnRzL1Jlc291cmNlVHlwZSc7XG5pbXBvcnQgeyBBYnNlbnRQZXJpb2QsIEF0dGVuZGFuY2UsIFBlcmlvZEluZm8gfSBmcm9tICcuL0ludGVyZmFjZXMvQXR0ZW5kYW5jZSc7XG5pbXBvcnQgeyBTY2hlZHVsZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU2NoZWR1bGUnO1xuaW1wb3J0IHsgU2NoZWR1bGUgfSBmcm9tICcuL0NsaWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCB7IFNjaG9vbEluZm9YTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1NjaG9vbEluZm8nO1xuaW1wb3J0IHsgUmVwb3J0Q2FyZHNYTUxPYmplY3QgfSBmcm9tICcuLi9SZXBvcnRDYXJkL1JlcG9ydENhcmQueG1sJztcbmltcG9ydCB7IERvY3VtZW50WE1MT2JqZWN0IH0gZnJvbSAnLi4vRG9jdW1lbnQvRG9jdW1lbnQueG1sJztcbmltcG9ydCBSZXBvcnRDYXJkIGZyb20gJy4uL1JlcG9ydENhcmQvUmVwb3J0Q2FyZCc7XG5pbXBvcnQgRG9jdW1lbnQgZnJvbSAnLi4vRG9jdW1lbnQvRG9jdW1lbnQnO1xuaW1wb3J0IFJlcXVlc3RFeGNlcHRpb24gZnJvbSAnLi4vUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcbmltcG9ydCBYTUxGYWN0b3J5IGZyb20gJy4uLy4uL3V0aWxzL1hNTEZhY3RvcnkvWE1MRmFjdG9yeSc7XG5pbXBvcnQgY2FjaGUgZnJvbSAnLi4vLi4vdXRpbHMvY2FjaGUvY2FjaGUnO1xuaW1wb3J0IHsgb3B0aW9uYWwsIGFzeW5jUG9vbEFsbCB9IGZyb20gJy4vQ2xpZW50LmhlbHBlcnMnO1xuXG4vKipcbiAqIFRoZSBTdHVkZW50VlVFIENsaWVudCB0byBhY2Nlc3MgdGhlIEFQSVxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCBleHRlbmRzIHNvYXAuQ2xpZW50IHtcbiAgcHJpdmF0ZSBob3N0VXJsOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzLCBob3N0VXJsOiBzdHJpbmcpIHtcbiAgICBzdXBlcihjcmVkZW50aWFscyk7XG4gICAgdGhpcy5ob3N0VXJsID0gaG9zdFVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSdzIHRoZSB1c2VyJ3MgY3JlZGVudGlhbHMuIEl0IHdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgY3JlZGVudGlhbHMgYXJlIGluY29ycmVjdFxuICAgKi9cbiAgcHVibGljIHZhbGlkYXRlQ3JlZGVudGlhbHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFBhcnNlZFJlcXVlc3RFcnJvcj4oeyBtZXRob2ROYW1lOiAnbG9naW4gdGVzdCcsIHZhbGlkYXRlRXJyb3JzOiBmYWxzZSB9KVxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAocmVzcG9uc2UuUlRfRVJST1JbMF1bJ0BfRVJST1JfTUVTU0FHRSddWzBdID09PSAnbG9naW4gdGVzdCBpcyBub3QgYSB2YWxpZCBtZXRob2QuJykgcmVzKCk7XG4gICAgICAgICAgZWxzZSByZWoobmV3IFJlcXVlc3RFeGNlcHRpb24ocmVzcG9uc2UpKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgc3R1ZGVudCdzIGRvY3VtZW50cyBmcm9tIHN5bmVyZ3kgc2VydmVyc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxEb2N1bWVudFtdPn0+IFJldHVybnMgYSBsaXN0IG9mIHN0dWRlbnQgZG9jdW1lbnRzXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBjb25zdCBkb2N1bWVudHMgPSBhd2FpdCBjbGllbnQuZG9jdW1lbnRzKCk7XG4gICAqIGNvbnN0IGRvY3VtZW50ID0gZG9jdW1lbnRzWzBdO1xuICAgKiBjb25zdCBmaWxlcyA9IGF3YWl0IGRvY3VtZW50LmdldCgpO1xuICAgKiBjb25zdCBiYXNlNjRjb2xsZWN0aW9uID0gZmlsZXMubWFwKChmaWxlKSA9PiBmaWxlLmJhc2U2NCk7XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIGRvY3VtZW50cygpOiBQcm9taXNlPERvY3VtZW50W10+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBzdXBlclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8RG9jdW1lbnRYTUxPYmplY3Q+KHtcbiAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0U3R1ZGVudERvY3VtZW50SW5pdGlhbERhdGEnLFxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xuICAgICAgICAgIHJlcyhcbiAgICAgICAgICAgIHhtbE9iamVjdFsnU3R1ZGVudERvY3VtZW50cyddWzBdLlN0dWRlbnREb2N1bWVudERhdGFzWzBdLlN0dWRlbnREb2N1bWVudERhdGEubWFwKFxuICAgICAgICAgICAgICAoeG1sKSA9PiBuZXcgRG9jdW1lbnQoeG1sLCBzdXBlci5jcmVkZW50aWFscylcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2gocmVqKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgbGlzdCBvZiByZXBvcnQgY2FyZHNcbiAgICogQHJldHVybnMge1Byb21pc2U8UmVwb3J0Q2FyZFtdPn0gUmV0dXJucyBhIGxpc3Qgb2YgcmVwb3J0IGNhcmRzIHRoYXQgY2FuIGZldGNoIGEgZmlsZVxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogYGBganNcbiAgICogY29uc3QgcmVwb3J0Q2FyZHMgPSBhd2FpdCBjbGllbnQucmVwb3J0Q2FyZHMoKTtcbiAgICogY29uc3QgZmlsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChyZXBvcnRDYXJkcy5tYXAoKGNhcmQpID0+IGNhcmQuZ2V0KCkpKTtcbiAgICogY29uc3QgYmFzZTY0YXJyID0gZmlsZXMubWFwKChmaWxlKSA9PiBmaWxlLmJhc2U2NCk7IC8vIFtcIkpWQkVSaTAuLi5cIiwgXCJkVUlvYTEuLi5cIiwgLi4uXTtcbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgcmVwb3J0Q2FyZHMoKTogUHJvbWlzZTxSZXBvcnRDYXJkW10+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBzdXBlclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8UmVwb3J0Q2FyZHNYTUxPYmplY3Q+KHtcbiAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0UmVwb3J0Q2FyZEluaXRpYWxEYXRhJyxcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcbiAgICAgICAgICByZXMoXG4gICAgICAgICAgICB4bWxPYmplY3QuUkNSZXBvcnRpbmdQZXJpb2REYXRhWzBdLlJDUmVwb3J0aW5nUGVyaW9kc1swXS5SQ1JlcG9ydGluZ1BlcmlvZC5tYXAoXG4gICAgICAgICAgICAgICh4bWwpID0+IG5ldyBSZXBvcnRDYXJkKHhtbCwgc3VwZXIuY3JlZGVudGlhbHMpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgc3R1ZGVudCdzIHNjaG9vbCdzIGluZm9ybWF0aW9uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNjaG9vbEluZm8+fSBSZXR1cm5zIHRoZSBpbmZvcm1hdGlvbiBvZiB0aGUgc3R1ZGVudCdzIHNjaG9vbFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogYGBganNcbiAgICogYXdhaXQgY2xpZW50LnNjaG9vbEluZm8oKTtcbiAgICpcbiAgICogY2xpZW50LnNjaG9vbEluZm8oKS50aGVuKChzY2hvb2xJbmZvKSA9PiB7XG4gICAqICBjb25zb2xlLmxvZyhfLnVuaXEoc2Nob29sSW5mby5zdGFmZi5tYXAoKHN0YWZmKSA9PiBzdGFmZi5uYW1lKSkpOyAvLyBMaXN0IGFsbCBzdGFmZiBwb3NpdGlvbnMgdXNpbmcgbG9kYXNoXG4gICAqIH0pXG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIHNjaG9vbEluZm8oKTogUHJvbWlzZTxTY2hvb2xJbmZvPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFNjaG9vbEluZm9YTUxPYmplY3Q+KHtcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudFNjaG9vbEluZm8nLFxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SUQ6IDAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHsgU3R1ZGVudFNjaG9vbEluZm9MaXN0aW5nOiBbeG1sT2JqZWN0XSB9KSA9PiB7XG4gICAgICAgICAgcmVzKHtcbiAgICAgICAgICAgIHNjaG9vbDoge1xuICAgICAgICAgICAgICBhZGRyZXNzOiB4bWxPYmplY3RbJ0BfU2Nob29sQWRkcmVzcyddWzBdLFxuICAgICAgICAgICAgICBhZGRyZXNzQWx0OiB4bWxPYmplY3RbJ0BfU2Nob29sQWRkcmVzczInXVswXSxcbiAgICAgICAgICAgICAgY2l0eTogeG1sT2JqZWN0WydAX1NjaG9vbENpdHknXVswXSxcbiAgICAgICAgICAgICAgemlwQ29kZTogeG1sT2JqZWN0WydAX1NjaG9vbFppcCddWzBdLFxuICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0WydAX1Bob25lJ11bMF0sXG4gICAgICAgICAgICAgIGFsdFBob25lOiB4bWxPYmplY3RbJ0BfUGhvbmUyJ11bMF0sXG4gICAgICAgICAgICAgIHByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdFsnQF9QcmluY2lwYWwnXVswXSxcbiAgICAgICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0WydAX1ByaW5jaXBhbEVtYWlsJ11bMF0sXG4gICAgICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0WydAX1ByaW5jaXBhbEd1J11bMF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RhZmY6IHhtbE9iamVjdC5TdGFmZkxpc3RzWzBdLlN0YWZmTGlzdC5tYXAoKHN0YWZmKSA9PiAoe1xuICAgICAgICAgICAgICBuYW1lOiBzdGFmZlsnQF9OYW1lJ11bMF0sXG4gICAgICAgICAgICAgIGVtYWlsOiBzdGFmZlsnQF9FTWFpbCddWzBdLFxuICAgICAgICAgICAgICBzdGFmZkd1OiBzdGFmZlsnQF9TdGFmZkdVJ11bMF0sXG4gICAgICAgICAgICAgIGpvYlRpdGxlOiBzdGFmZlsnQF9UaXRsZSddWzBdLFxuICAgICAgICAgICAgICBleHRuOiBzdGFmZlsnQF9FeHRuJ11bMF0sXG4gICAgICAgICAgICAgIHBob25lOiBzdGFmZlsnQF9QaG9uZSddWzBdLFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2gocmVqKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzY2hlZHVsZSBvZiB0aGUgc3R1ZGVudFxuICAgKiBAcGFyYW0ge251bWJlcn0gdGVybUluZGV4IFRoZSBpbmRleCBvZiB0aGUgdGVybS5cbiAgICogQHJldHVybnMge1Byb21pc2U8U2NoZWR1bGU+fSBSZXR1cm5zIHRoZSBzY2hlZHVsZSBvZiB0aGUgc3R1ZGVudFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogYGBganNcbiAgICogYXdhaXQgc2NoZWR1bGUoMCkgLy8gLT4geyB0ZXJtOiB7IGluZGV4OiAwLCBuYW1lOiAnMXN0IFF0ciBQcm9ncmVzcycgfSwgLi4uIH1cbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgc2NoZWR1bGUodGVybUluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxTY2hlZHVsZT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIHN1cGVyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxTY2hlZHVsZVhNTE9iamVjdD4oe1xuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50Q2xhc3NMaXN0JyxcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCAuLi4odGVybUluZGV4ICE9IG51bGwgPyB7IFRlcm1JbmRleDogdGVybUluZGV4IH0gOiB7fSkgfSxcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xuICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICB0ZXJtOiB7XG4gICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIoeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdWydAX1Rlcm1JbmRleCddWzBdKSxcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdWydAX1Rlcm1JbmRleE5hbWUnXVswXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdWydAX0Vycm9yTWVzc2FnZSddWzBdLFxuICAgICAgICAgICAgdG9kYXk6XG4gICAgICAgICAgICAgIHR5cGVvZiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVG9kYXlTY2hlZHVsZUluZm9EYXRhWzBdLlNjaG9vbEluZm9zWzBdICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgID8geG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLlRvZGF5U2NoZWR1bGVJbmZvRGF0YVswXS5TY2hvb2xJbmZvc1swXS5TY2hvb2xJbmZvLm1hcChcbiAgICAgICAgICAgICAgICAgICAgKHNjaG9vbCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzY2hvb2xbJ0BfU2Nob29sTmFtZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIGJlbGxTY2hlZHVsZU5hbWU6IHNjaG9vbFsnQF9CZWxsU2NoZWROYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NlczpcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBzY2hvb2wuQ2xhc3Nlc1swXSAhPT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyBzY2hvb2wuQ2xhc3Nlc1swXS5DbGFzc0luZm8ubWFwPENsYXNzU2NoZWR1bGVJbmZvPigoY291cnNlKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoY291cnNlWydAX1BlcmlvZCddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGVuZGFuY2VDb2RlOiBjb3Vyc2UuQXR0ZW5kYW5jZUNvZGVbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShjb3Vyc2VbJ0BfU3RhcnREYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKGNvdXJzZVsnQF9FbmREYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9DbGFzc05hbWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25HdTogY291cnNlWydAX1NlY3Rpb25HVSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVhY2hlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogY291cnNlWydAX1RlYWNoZXJFbWFpbCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbFN1YmplY3Q6IGNvdXJzZVsnQF9FbWFpbFN1YmplY3QnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY291cnNlWydAX1RlYWNoZXJOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IGNvdXJzZVsnQF9TdGFmZkdVJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY291cnNlWydAX1RlYWNoZXJVUkwnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGNvdXJzZVsnQF9DbGFzc1VSTCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogcGFyc2UoY291cnNlWydAX1N0YXJ0VGltZSddWzBdLCAnaGg6bW0gYScsIERhdGUubm93KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IHBhcnNlKGNvdXJzZVsnQF9FbmRUaW1lJ11bMF0sICdoaDptbSBhJywgRGF0ZS5ub3coKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vbTogY291cnNlWydAX1Jvb21OYW1lJ11bMF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgICAgY2xhc3NlczpcbiAgICAgICAgICAgICAgdHlwZW9mIHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5DbGFzc0xpc3RzWzBdICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgID8geG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLkNsYXNzTGlzdHNbMF0uQ2xhc3NMaXN0aW5nLm1hcCgoc3R1ZGVudENsYXNzKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdHVkZW50Q2xhc3NbJ0BfQ291cnNlVGl0bGUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoc3R1ZGVudENsYXNzWydAX1BlcmlvZCddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgcm9vbTogc3R1ZGVudENsYXNzWydAX1Jvb21OYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgIHNlY3Rpb25HdTogc3R1ZGVudENsYXNzWydAX1NlY3Rpb25HVSddWzBdLFxuICAgICAgICAgICAgICAgICAgICB0ZWFjaGVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogc3R1ZGVudENsYXNzWydAX1RlYWNoZXInXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogc3R1ZGVudENsYXNzWydAX1RlYWNoZXJFbWFpbCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyU3RhZmZHVSddWzBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgICAgIHRlcm1zOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVGVybUxpc3RzWzBdLlRlcm1MaXN0aW5nLm1hcCgodGVybSkgPT4gKHtcbiAgICAgICAgICAgICAgZGF0ZToge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh0ZXJtWydAX0JlZ2luRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHRlcm1bJ0BfRW5kRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcih0ZXJtWydAX1Rlcm1JbmRleCddWzBdKSxcbiAgICAgICAgICAgICAgbmFtZTogdGVybVsnQF9UZXJtTmFtZSddWzBdLFxuICAgICAgICAgICAgICBzY2hvb2xZZWFyVGVybUNvZGVHdTogdGVybVsnQF9TY2hvb2xZZWFyVHJtQ29kZUdVJ11bMF0sXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWopO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGF0dGVuZGFuY2Ugb2YgdGhlIHN0dWRlbnRcbiAgICogQHJldHVybnMge1Byb21pc2U8QXR0ZW5kYW5jZT59IFJldHVybnMgYW4gQXR0ZW5kYW5jZSBvYmplY3RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGNsaWVudC5hdHRlbmRhbmNlKClcbiAgICogIC50aGVuKGNvbnNvbGUubG9nKTsgLy8gLT4geyB0eXBlOiAnUGVyaW9kJywgcGVyaW9kOiB7Li4ufSwgc2Nob29sTmFtZTogJ1VuaXZlcnNpdHkgSGlnaCBTY2hvb2wnLCBhYnNlbmNlczogWy4uLl0sIHBlcmlvZEluZm9zOiBbLi4uXSB9XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIGF0dGVuZGFuY2UoKTogUHJvbWlzZTxBdHRlbmRhbmNlPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PEF0dGVuZGFuY2VYTUxPYmplY3Q+KHtcbiAgICAgICAgICBtZXRob2ROYW1lOiAnQXR0ZW5kYW5jZScsXG4gICAgICAgICAgcGFyYW1TdHI6IHtcbiAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKGF0dGVuZGFuY2VYTUxPYmplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB4bWxPYmplY3QgPSBhdHRlbmRhbmNlWE1MT2JqZWN0LkF0dGVuZGFuY2VbMF07XG5cbiAgICAgICAgICByZXMoe1xuICAgICAgICAgICAgdHlwZTogeG1sT2JqZWN0WydAX1R5cGUnXVswXSxcbiAgICAgICAgICAgIHBlcmlvZDoge1xuICAgICAgICAgICAgICB0b3RhbDogTnVtYmVyKHhtbE9iamVjdFsnQF9QZXJpb2RDb3VudCddWzBdKSxcbiAgICAgICAgICAgICAgc3RhcnQ6IE51bWJlcih4bWxPYmplY3RbJ0BfU3RhcnRQZXJpb2QnXVswXSksXG4gICAgICAgICAgICAgIGVuZDogTnVtYmVyKHhtbE9iamVjdFsnQF9FbmRQZXJpb2QnXVswXSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2Nob29sTmFtZTogeG1sT2JqZWN0WydAX1NjaG9vbE5hbWUnXVswXSxcbiAgICAgICAgICAgIGFic2VuY2VzOiB4bWxPYmplY3QuQWJzZW5jZXNbMF0uQWJzZW5jZVxuICAgICAgICAgICAgICA/IHhtbE9iamVjdC5BYnNlbmNlc1swXS5BYnNlbmNlLm1hcCgoYWJzZW5jZSkgPT4gKHtcbiAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFic2VuY2VbJ0BfQWJzZW5jZURhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgICByZWFzb246IGFic2VuY2VbJ0BfUmVhc29uJ11bMF0sXG4gICAgICAgICAgICAgICAgICBub3RlOiBhYnNlbmNlWydAX05vdGUnXVswXSxcbiAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBhYnNlbmNlWydAX0NvZGVBbGxEYXlEZXNjcmlwdGlvbiddWzBdLFxuICAgICAgICAgICAgICAgICAgcGVyaW9kczogYWJzZW5jZS5QZXJpb2RzWzBdLlBlcmlvZC5tYXAoXG4gICAgICAgICAgICAgICAgICAgIChwZXJpb2QpID0+XG4gICAgICAgICAgICAgICAgICAgICAgKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKHBlcmlvZFsnQF9OdW1iZXInXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfTmFtZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBwZXJpb2RbJ0BfUmVhc29uJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Vyc2U6IHBlcmlvZFsnQF9Db3Vyc2UnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWZmOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9TdGFmZiddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBwZXJpb2RbJ0BfU3RhZmZHVSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogcGVyaW9kWydAX1N0YWZmRU1haWwnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmdZZWFyR3U6IHBlcmlvZFsnQF9PcmdZZWFyR1UnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICB9IGFzIEFic2VudFBlcmlvZClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgIDogW10sXG4gICAgICAgICAgICBwZXJpb2RJbmZvczogeG1sT2JqZWN0LlRvdGFsQWN0aXZpdGllc1swXS5QZXJpb2RUb3RhbC5tYXAoKHBkLCBpKSA9PiAoe1xuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZFsnQF9OdW1iZXInXVswXSksXG4gICAgICAgICAgICAgIHRvdGFsOiB7XG4gICAgICAgICAgICAgICAgZXhjdXNlZDogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbEV4Y3VzZWRbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXG4gICAgICAgICAgICAgICAgdGFyZGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbFRhcmRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXG4gICAgICAgICAgICAgICAgdW5leGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxBY3Rpdml0aWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxuICAgICAgICAgICAgICAgIHVuZXhjdXNlZFRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSkpIGFzIFBlcmlvZEluZm9bXSxcbiAgICAgICAgICB9IGFzIEF0dGVuZGFuY2UpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2gocmVqKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBncmFkZWJvb2sgb2YgdGhlIHN0dWRlbnRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJlcG9ydGluZ1BlcmlvZEluZGV4IFRoZSB0aW1lZnJhbWUgdGhhdCB0aGUgZ3JhZGVib29rIHNob3VsZCByZXR1cm5cbiAgICogQHJldHVybnMge1Byb21pc2U8R3JhZGVib29rPn0gUmV0dXJucyBhIEdyYWRlYm9vayBvYmplY3RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGNvbnN0IGdyYWRlYm9vayA9IGF3YWl0IGNsaWVudC5ncmFkZWJvb2soKTtcbiAgICogY29uc29sZS5sb2coZ3JhZGVib29rKTsgLy8geyBlcnJvcjogJycsIHR5cGU6ICdUcmFkaXRpb25hbCcsIHJlcG9ydGluZ1BlcmlvZDogey4uLn0sIGNvdXJzZXM6IFsuLi5dIH07XG4gICAqXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soMCkgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCAwIGFzIFwiMXN0IFF1YXJ0ZXIgUHJvZ3Jlc3NcIlxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDcpIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggNyBhcyBcIjR0aCBRdWFydGVyXCJcbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgZ3JhZGVib29rKHJlcG9ydGluZ1BlcmlvZEluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxHcmFkZWJvb2s+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBzdXBlclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8R3JhZGVib29rWE1MT2JqZWN0PihcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtZXRob2ROYW1lOiAnR3JhZGVib29rJyxcbiAgICAgICAgICAgIHBhcmFtU3RyOiB7XG4gICAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXG4gICAgICAgICAgICAgIC4uLihyZXBvcnRpbmdQZXJpb2RJbmRleCAhPSBudWxsID8geyBSZXBvcnRQZXJpb2Q6IHJlcG9ydGluZ1BlcmlvZEluZGV4IH0gOiB7fSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgKHhtbCkgPT5cbiAgICAgICAgICAgIG5ldyBYTUxGYWN0b3J5KHhtbClcbiAgICAgICAgICAgICAgLmVuY29kZUF0dHJpYnV0ZSgnTWVhc3VyZURlc2NyaXB0aW9uJywgJ0hhc0Ryb3BCb3gnKVxuICAgICAgICAgICAgICAuZW5jb2RlQXR0cmlidXRlKCdNZWFzdXJlJywgJ1R5cGUnKVxuICAgICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICApXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3Q6IEdyYWRlYm9va1hNTE9iamVjdCkgPT4ge1xuICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICBlcnJvcjogeG1sT2JqZWN0LkdyYWRlYm9va1swXVsnQF9FcnJvck1lc3NhZ2UnXVswXSxcbiAgICAgICAgICAgIHR5cGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfVHlwZSddWzBdLFxuICAgICAgICAgICAgcmVwb3J0aW5nUGVyaW9kOiB7XG4gICAgICAgICAgICAgIGN1cnJlbnQ6IHtcbiAgICAgICAgICAgICAgICBpbmRleDpcbiAgICAgICAgICAgICAgICAgIHJlcG9ydGluZ1BlcmlvZEluZGV4ID8/XG4gICAgICAgICAgICAgICAgICBOdW1iZXIoXG4gICAgICAgICAgICAgICAgICAgIHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QuZmluZChcbiAgICAgICAgICAgICAgICAgICAgICAoeCkgPT4geFsnQF9HcmFkZVBlcmlvZCddWzBdID09PSB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9HcmFkZVBlcmlvZCddWzBdXG4gICAgICAgICAgICAgICAgICAgICk/LlsnQF9JbmRleCddWzBdXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIGRhdGU6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9TdGFydERhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0VuZERhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9HcmFkZVBlcmlvZCddWzBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBhdmFpbGFibGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QubWFwKChwZXJpb2QpID0+ICh7XG4gICAgICAgICAgICAgICAgZGF0ZTogeyBzdGFydDogbmV3IERhdGUocGVyaW9kWydAX1N0YXJ0RGF0ZSddWzBdKSwgZW5kOiBuZXcgRGF0ZShwZXJpb2RbJ0BfRW5kRGF0ZSddWzBdKSB9LFxuICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9HcmFkZVBlcmlvZCddWzBdLFxuICAgICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIocGVyaW9kWydAX0luZGV4J11bMF0pLFxuICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY291cnNlczogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5Db3Vyc2VzWzBdLkNvdXJzZS5tYXAoKGNvdXJzZSkgPT4gKHtcbiAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoY291cnNlWydAX1BlcmlvZCddWzBdKSxcbiAgICAgICAgICAgICAgdGl0bGU6IGNvdXJzZVsnQF9UaXRsZSddWzBdLFxuICAgICAgICAgICAgICByb29tOiBjb3Vyc2VbJ0BfUm9vbSddWzBdLFxuICAgICAgICAgICAgICBzdGFmZjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9TdGFmZiddWzBdLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBjb3Vyc2VbJ0BfU3RhZmZFTWFpbCddWzBdLFxuICAgICAgICAgICAgICAgIHN0YWZmR3U6IGNvdXJzZVsnQF9TdGFmZkdVJ11bMF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1hcmtzOiBjb3Vyc2UuTWFya3NbMF0uTWFyay5tYXAoKG1hcmspID0+ICh7XG4gICAgICAgICAgICAgICAgbmFtZTogbWFya1snQF9NYXJrTmFtZSddWzBdLFxuICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRTY29yZToge1xuICAgICAgICAgICAgICAgICAgc3RyaW5nOiBtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVN0cmluZyddWzBdLFxuICAgICAgICAgICAgICAgICAgcmF3OiBOdW1iZXIobWFya1snQF9DYWxjdWxhdGVkU2NvcmVSYXcnXVswXSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZENhdGVnb3JpZXM6XG4gICAgICAgICAgICAgICAgICB0eXBlb2YgbWFya1snR3JhZGVDYWxjdWxhdGlvblN1bW1hcnknXVswXSAhPT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgPyBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdLkFzc2lnbm1lbnRHcmFkZUNhbGMubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgKHdlaWdodGVkKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHdlaWdodGVkWydAX1R5cGUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkTWFyazogd2VpZ2h0ZWRbJ0BfQ2FsY3VsYXRlZE1hcmsnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2YWx1YXRlZDogd2VpZ2h0ZWRbJ0BfV2VpZ2h0ZWRQY3QnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkOiB3ZWlnaHRlZFsnQF9XZWlnaHQnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50cyddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3NpYmxlOiBOdW1iZXIod2VpZ2h0ZWRbJ0BfUG9pbnRzUG9zc2libGUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBXZWlnaHRlZENhdGVnb3J5KVxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50czpcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBtYXJrLkFzc2lnbm1lbnRzWzBdICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IChtYXJrLkFzc2lnbm1lbnRzWzBdLkFzc2lnbm1lbnQubWFwKChhc3NpZ25tZW50KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhZGVib29rSWQ6IGFzc2lnbm1lbnRbJ0BfR3JhZGVib29rSUQnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGRlY29kZVVSSShhc3NpZ25tZW50WydAX01lYXN1cmUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhc3NpZ25tZW50WydAX1R5cGUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHVlOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0R1ZURhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYXNzaWdubWVudFsnQF9TY29yZVR5cGUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGFzc2lnbm1lbnRbJ0BfU2NvcmUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IGFzc2lnbm1lbnRbJ0BfUG9pbnRzJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlczogYXNzaWdubWVudFsnQF9Ob3RlcyddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVhY2hlcklkOiBhc3NpZ25tZW50WydAX1RlYWNoZXJJRCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlY29kZVVSSShhc3NpZ25tZW50WydAX01lYXN1cmVEZXNjcmlwdGlvbiddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0Ryb3Bib3g6IEpTT04ucGFyc2UoYXNzaWdubWVudFsnQF9IYXNEcm9wQm94J11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudElkOiBhc3NpZ25tZW50WydAX1N0dWRlbnRJRCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGJveERhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRHJvcFN0YXJ0RGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0Ryb3BFbmREYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdLlJlc291cmNlLm1hcCgocnNyYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJzcmNbJ0BfVHlwZSddWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnRmlsZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVSc3JjID0gcnNyYyBhcyBGaWxlUmVzb3VyY2VYTUxPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBSZXNvdXJjZVR5cGUuRklMRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpbGVSc3JjWydAX0ZpbGVUeXBlJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZVJzcmNbJ0BfRmlsZU5hbWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmk6IHRoaXMuaG9zdFVybCArIGZpbGVSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZmlsZVJzcmNbJ0BfUmVzb3VyY2VEYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBmaWxlUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZVJzcmNbJ0BfUmVzb3VyY2VOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEZpbGVSZXNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnVVJMJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsUnNyYyA9IHJzcmMgYXMgVVJMUmVzb3VyY2VYTUxPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybFJzcmNbJ0BfVVJMJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFJlc291cmNlVHlwZS5VUkwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUodXJsUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHVybFJzcmNbJ0BfUmVzb3VyY2VJRCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHVybFJzcmNbJ0BfUmVzb3VyY2VOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVybFJzcmNbJ0BfUmVzb3VyY2VEZXNjcmlwdGlvbiddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB1cmxSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFVSTFJlc291cmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgVHlwZSAke3JzcmNbJ0BfVHlwZSddWzBdfSBkb2VzIG5vdCBleGlzdCBhcyBhIHR5cGUuIEFkZCBpdCB0byB0eXBlIGRlY2xhcmF0aW9ucy5gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSBhcyAoRmlsZVJlc291cmNlIHwgVVJMUmVzb3VyY2UpW10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICB9KSkgYXMgQXNzaWdubWVudFtdKVxuICAgICAgICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgICAgICB9KSkgYXMgTWFya1tdLFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgIH0gYXMgR3JhZGVib29rKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbGlzdCBvZiBtZXNzYWdlcyBvZiB0aGUgc3R1ZGVudFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNZXNzYWdlW10+fSBSZXR1cm5zIGFuIGFycmF5IG9mIG1lc3NhZ2VzIG9mIHRoZSBzdHVkZW50XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gLT4gW3sgaWQ6ICdFOTcyRjFCQy05OUEwLTRDRDAtOEQxNS1CMTg5NjhCNDNFMDgnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH0sIHsgaWQ6ICc4NkZEQTExRC00MkM3LTQyNDktQjAwMy05NEIxNUVCMkM4RDQnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH1dXG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIG1lc3NhZ2VzKCk6IFByb21pc2U8TWVzc2FnZVtdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PE1lc3NhZ2VYTUxPYmplY3Q+KFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRQWFBNZXNzYWdlcycsXG4gICAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAoeG1sKSA9PiBuZXcgWE1MRmFjdG9yeSh4bWwpLmVuY29kZUF0dHJpYnV0ZSgnQ29udGVudCcsICdSZWFkJykudG9TdHJpbmcoKVxuICAgICAgICApXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcbiAgICAgICAgICByZXMoXG4gICAgICAgICAgICB4bWxPYmplY3QuUFhQTWVzc2FnZXNEYXRhWzBdLk1lc3NhZ2VMaXN0aW5nc1swXS5NZXNzYWdlTGlzdGluZy5tYXAoXG4gICAgICAgICAgICAgIChtZXNzYWdlKSA9PiBuZXcgTWVzc2FnZShtZXNzYWdlLCBzdXBlci5jcmVkZW50aWFscywgdGhpcy5ob3N0VXJsKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWopO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGluZm8gb2YgYSBzdHVkZW50XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0dWRlbnRJbmZvPn0gU3R1ZGVudEluZm8gb2JqZWN0XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBzdHVkZW50SW5mbygpLnRoZW4oY29uc29sZS5sb2cpIC8vIC0+IHsgc3R1ZGVudDogeyBuYW1lOiAnRXZhbiBEYXZpcycsIG5pY2tuYW1lOiAnJywgbGFzdE5hbWU6ICdEYXZpcycgfSwgLi4ufVxuICAgKiBgYGBcbiAgICovXG4gIHB1YmxpYyBzdHVkZW50SW5mbygpOiBQcm9taXNlPFN0dWRlbnRJbmZvPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFN0dWRlbnRJbmZvPigocmVzLCByZWopID0+IHtcbiAgICAgIHN1cGVyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxTdHVkZW50SW5mb1hNTE9iamVjdD4oe1xuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50SW5mbycsXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoeG1sT2JqZWN0RGF0YSkgPT4ge1xuICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICBzdHVkZW50OiB7XG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRm9ybWF0dGVkTmFtZVswXSxcbiAgICAgICAgICAgICAgbGFzdE5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uTGFzdE5hbWVHb2VzQnlbMF0sXG4gICAgICAgICAgICAgIG5pY2tuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLk5pY2tOYW1lWzBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5CaXJ0aERhdGVbMF0pLFxuICAgICAgICAgICAgdHJhY2s6IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uVHJhY2spLFxuICAgICAgICAgICAgYWRkcmVzczogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzKSxcbiAgICAgICAgICAgIHBob3RvOiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBob3RvKSxcbiAgICAgICAgICAgIGNvdW5zZWxvcjpcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Db3Vuc2Vsb3JOYW1lICYmXG4gICAgICAgICAgICAgIHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yRW1haWwgJiZcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Db3Vuc2Vsb3JTdGFmZkdVXG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yTmFtZVswXSxcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yRW1haWxbMF0sXG4gICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yU3RhZmZHVVswXSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGN1cnJlbnRTY2hvb2w6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ3VycmVudFNjaG9vbFswXSxcbiAgICAgICAgICAgIGRlbnRpc3Q6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRGVudGlzdFxuICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRGVudGlzdFswXVsnQF9OYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5EZW50aXN0WzBdWydAX1Bob25lJ11bMF0sXG4gICAgICAgICAgICAgICAgICBleHRuOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkRlbnRpc3RbMF1bJ0BfRXh0biddWzBdLFxuICAgICAgICAgICAgICAgICAgb2ZmaWNlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkRlbnRpc3RbMF1bJ0BfT2ZmaWNlJ11bMF0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBoeXNpY2lhbjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaHlzaWNpYW5cbiAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBoeXNpY2lhblswXVsnQF9OYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaHlzaWNpYW5bMF1bJ0BfUGhvbmUnXVswXSxcbiAgICAgICAgICAgICAgICAgIGV4dG46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGh5c2ljaWFuWzBdWydAX0V4dG4nXVswXSxcbiAgICAgICAgICAgICAgICAgIGhvc3BpdGFsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBoeXNpY2lhblswXVsnQF9Ib3NwaXRhbCddWzBdLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBpZDogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QZXJtSUQpLFxuICAgICAgICAgICAgb3JnWWVhckd1OiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLk9yZ1llYXJHVSksXG4gICAgICAgICAgICBwaG9uZTogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaG9uZSksXG4gICAgICAgICAgICBlbWFpbDogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5FTWFpbCksXG4gICAgICAgICAgICBlbWVyZ2VuY3lDb250YWN0czogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5FbWVyZ2VuY3lDb250YWN0c1xuICAgICAgICAgICAgICA/IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRW1lcmdlbmN5Q29udGFjdHNbMF0uRW1lcmdlbmN5Q29udGFjdC5tYXAoKGNvbnRhY3QpID0+ICh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBvcHRpb25hbChjb250YWN0WydAX05hbWUnXSksXG4gICAgICAgICAgICAgICAgICBwaG9uZToge1xuICAgICAgICAgICAgICAgICAgICBob21lOiBvcHRpb25hbChjb250YWN0WydAX0hvbWVQaG9uZSddKSxcbiAgICAgICAgICAgICAgICAgICAgbW9iaWxlOiBvcHRpb25hbChjb250YWN0WydAX01vYmlsZVBob25lJ10pLFxuICAgICAgICAgICAgICAgICAgICBvdGhlcjogb3B0aW9uYWwoY29udGFjdFsnQF9PdGhlclBob25lJ10pLFxuICAgICAgICAgICAgICAgICAgICB3b3JrOiBvcHRpb25hbChjb250YWN0WydAX1dvcmtQaG9uZSddKSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IG9wdGlvbmFsKGNvbnRhY3RbJ0BfUmVsYXRpb25zaGlwJ10pLFxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgICAgZ2VuZGVyOiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkdlbmRlciksXG4gICAgICAgICAgICBncmFkZTogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HcmFkZSksXG4gICAgICAgICAgICBsb2NrZXJJbmZvUmVjb3Jkczogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Mb2NrZXJJbmZvUmVjb3JkcyksXG4gICAgICAgICAgICBob21lTGFuZ3VhZ2U6IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uSG9tZUxhbmd1YWdlKSxcbiAgICAgICAgICAgIGhvbWVSb29tOiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkhvbWVSb29tKSxcbiAgICAgICAgICAgIGhvbWVSb29tVGVhY2hlcjoge1xuICAgICAgICAgICAgICBlbWFpbDogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Ib21lUm9vbVRjaEVNYWlsKSxcbiAgICAgICAgICAgICAgbmFtZTogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Ib21lUm9vbVRjaCksXG4gICAgICAgICAgICAgIHN0YWZmR3U6IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uSG9tZVJvb21UY2hTdGFmZkdVKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRpdGlvbmFsSW5mbzogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94ZXNbMF0uVXNlckRlZmluZWRHcm91cEJveFxuICAgICAgICAgICAgICA/ICh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3hlc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94Lm1hcCgoZGVmaW5lZEJveCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgIGlkOiBvcHRpb25hbChkZWZpbmVkQm94WydAX0dyb3VwQm94SUQnXSksIC8vIHN0cmluZyB8IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgdHlwZTogZGVmaW5lZEJveFsnQF9Hcm91cEJveExhYmVsJ11bMF0sIC8vIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgdmNJZDogb3B0aW9uYWwoZGVmaW5lZEJveFsnQF9WQ0lEJ10pLCAvLyBzdHJpbmcgfCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgIGl0ZW1zOiBkZWZpbmVkQm94LlVzZXJEZWZpbmVkSXRlbXNbMF0uVXNlckRlZmluZWRJdGVtLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogaXRlbVsnQF9Tb3VyY2VFbGVtZW50J11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBpdGVtWydAX1NvdXJjZU9iamVjdCddWzBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2Y0lkOiBpdGVtWydAX1ZDSUQnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1bJ0BfVmFsdWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogaXRlbVsnQF9JdGVtVHlwZSddWzBdLFxuICAgICAgICAgICAgICAgICAgfSkpIGFzIEFkZGl0aW9uYWxJbmZvSXRlbVtdLFxuICAgICAgICAgICAgICAgIH0pKSBhcyBBZGRpdGlvbmFsSW5mb1tdKVxuICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgIH0gYXMgU3R1ZGVudEluZm8pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2gocmVqKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlOiBEYXRlKSB7XG4gICAgcmV0dXJuIHN1cGVyLnByb2Nlc3NSZXF1ZXN0PENhbGVuZGFyWE1MT2JqZWN0PihcbiAgICAgIHtcbiAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDYWxlbmRhcicsXG4gICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIFJlcXVlc3REYXRlOiBkYXRlLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgIH0sXG4gICAgICAoeG1sKSA9PiBuZXcgWE1MRmFjdG9yeSh4bWwpLmVuY29kZUF0dHJpYnV0ZSgnVGl0bGUnLCAnSWNvbicpLnRvU3RyaW5nKClcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7Q2FsZW5kYXJPcHRpb25zfSBvcHRpb25zIE9wdGlvbnMgdG8gcHJvdmlkZSBmb3IgY2FsZW5kYXIgbWV0aG9kLiBBbiBpbnRlcnZhbCBpcyByZXF1aXJlZC5cbiAgICogQHJldHVybnMge1Byb21pc2U8Q2FsZW5kYXI+fSBSZXR1cm5zIGEgQ2FsZW5kYXIgb2JqZWN0XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBjbGllbnQuY2FsZW5kYXIoeyBpbnRlcnZhbDogeyBzdGFydDogbmV3IERhdGUoJzUvMS8yMDIyJyksIGVuZDogbmV3IERhdGUoJzgvMS8yMDIxJykgfSwgY29uY3VycmVuY3k6IG51bGwgfSk7IC8vIC0+IExpbWl0bGVzcyBjb25jdXJyZW5jeSAobm90IHJlY29tbWVuZGVkKVxuICAgKlxuICAgKiBjb25zdCBjYWxlbmRhciA9IGF3YWl0IGNsaWVudC5jYWxlbmRhcih7IGludGVydmFsOiB7IC4uLiB9fSk7XG4gICAqIGNvbnNvbGUubG9nKGNhbGVuZGFyKTsgLy8gLT4geyBzY2hvb2xEYXRlOiB7Li4ufSwgb3V0cHV0UmFuZ2U6IHsuLi59LCBldmVudHM6IFsuLi5dIH1cbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgY2FsZW5kYXIob3B0aW9uczogQ2FsZW5kYXJPcHRpb25zID0ge30pOiBQcm9taXNlPENhbGVuZGFyPiB7XG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyA9IHtcbiAgICAgIGNvbmN1cnJlbmN5OiA3LFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuICAgIGNvbnN0IGNhbCA9IGF3YWl0IGNhY2hlLm1lbW8oKCkgPT4gdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKG5ldyBEYXRlKCkpKTtcbiAgICBjb25zdCBzY2hvb2xFbmREYXRlOiBEYXRlIHwgbnVtYmVyID1cbiAgICAgIG9wdGlvbnMuaW50ZXJ2YWw/LmVuZCA/PyBuZXcgRGF0ZShjYWwuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEVuZERhdGUnXVswXSk7XG4gICAgY29uc3Qgc2Nob29sU3RhcnREYXRlOiBEYXRlIHwgbnVtYmVyID1cbiAgICAgIG9wdGlvbnMuaW50ZXJ2YWw/LnN0YXJ0ID8/IG5ldyBEYXRlKGNhbC5DYWxlbmRhckxpc3RpbmdbMF1bJ0BfU2Nob29sQmVnRGF0ZSddWzBdKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIGNvbnN0IG1vbnRoc1dpdGhpblNjaG9vbFllYXIgPSBlYWNoTW9udGhPZkludGVydmFsKHsgc3RhcnQ6IHNjaG9vbFN0YXJ0RGF0ZSwgZW5kOiBzY2hvb2xFbmREYXRlIH0pO1xuICAgICAgY29uc3QgZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciA9ICgpOiBQcm9taXNlPENhbGVuZGFyWE1MT2JqZWN0W10+ID0+XG4gICAgICAgIGRlZmF1bHRPcHRpb25zLmNvbmN1cnJlbmN5ID09IG51bGxcbiAgICAgICAgICA/IFByb21pc2UuYWxsKG1vbnRoc1dpdGhpblNjaG9vbFllYXIubWFwKChkYXRlKSA9PiB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwoZGF0ZSkpKVxuICAgICAgICAgIDogYXN5bmNQb29sQWxsKGRlZmF1bHRPcHRpb25zLmNvbmN1cnJlbmN5LCBtb250aHNXaXRoaW5TY2hvb2xZZWFyLCAoZGF0ZSkgPT5cbiAgICAgICAgICAgICAgdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpXG4gICAgICAgICAgICApO1xuICAgICAgbGV0IG1lbW86IENhbGVuZGFyIHwgbnVsbCA9IG51bGw7XG4gICAgICBnZXRBbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyKClcbiAgICAgICAgLnRoZW4oKGV2ZW50cykgPT4ge1xuICAgICAgICAgIGNvbnN0IGFsbEV2ZW50cyA9IGV2ZW50cy5yZWR1Y2UoKHByZXYsIGV2ZW50cykgPT4ge1xuICAgICAgICAgICAgaWYgKG1lbW8gPT0gbnVsbClcbiAgICAgICAgICAgICAgbWVtbyA9IHtcbiAgICAgICAgICAgICAgICBzY2hvb2xEYXRlOiB7XG4gICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXVsnQF9TY2hvb2xCZWdEYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEVuZERhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvdXRwdXRSYW5nZToge1xuICAgICAgICAgICAgICAgICAgc3RhcnQ6IHNjaG9vbFN0YXJ0RGF0ZSxcbiAgICAgICAgICAgICAgICAgIGVuZDogc2Nob29sRW5kRGF0ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV2ZW50czogW10sXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCByZXN0OiBDYWxlbmRhciA9IHtcbiAgICAgICAgICAgICAgLi4ubWVtbywgLy8gVGhpcyBpcyB0byBwcmV2ZW50IHJlLWluaXRpYWxpemluZyBEYXRlIG9iamVjdHMgaW4gb3JkZXIgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICBldmVudHM6IFtcbiAgICAgICAgICAgICAgICAuLi4ocHJldi5ldmVudHMgPyBwcmV2LmV2ZW50cyA6IFtdKSxcbiAgICAgICAgICAgICAgICAuLi4odHlwZW9mIGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF0uRXZlbnRMaXN0c1swXSAhPT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgID8gKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF0uRXZlbnRMaXN0c1swXS5FdmVudExpc3QubWFwKChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnRbJ0BfRGF5VHlwZSddWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5BU1NJR05NRU5UOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2lnbm1lbnRFdmVudCA9IGV2ZW50IGFzIEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZGVjb2RlVVJJKGFzc2lnbm1lbnRFdmVudFsnQF9UaXRsZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRMaW5rRGF0YTogYXNzaWdubWVudEV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfQUdVJ10gPyBhc3NpZ25tZW50RXZlbnRbJ0BfQUdVJ11bMF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoYXNzaWdubWVudEV2ZW50WydAX0RhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfREdVJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogYXNzaWdubWVudEV2ZW50WydAX0xpbmsnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IGFzc2lnbm1lbnRFdmVudFsnQF9TdGFydFRpbWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuQVNTSUdOTUVOVCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3VHlwZTogYXNzaWdubWVudEV2ZW50WydAX1ZpZXdUeXBlJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgQXNzaWdubWVudEV2ZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuSE9MSURBWToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBkZWNvZGVVUkkoZXZlbnRbJ0BfVGl0bGUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLkhPTElEQVksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBldmVudFsnQF9TdGFydFRpbWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShldmVudFsnQF9EYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEhvbGlkYXlFdmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlJFR1VMQVI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVndWxhckV2ZW50ID0gZXZlbnQgYXMgUmVndWxhckV2ZW50WE1MT2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBkZWNvZGVVUkkocmVndWxhckV2ZW50WydAX1RpdGxlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFndTogcmVndWxhckV2ZW50WydAX0FHVSddID8gcmVndWxhckV2ZW50WydAX0FHVSddWzBdIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHJlZ3VsYXJFdmVudFsnQF9EYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiByZWd1bGFyRXZlbnRbJ0BfRXZ0RGVzY3JpcHRpb24nXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZWd1bGFyRXZlbnRbJ0BfRXZ0RGVzY3JpcHRpb24nXVswXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGd1OiByZWd1bGFyRXZlbnRbJ0BfREdVJ10gPyByZWd1bGFyRXZlbnRbJ0BfREdVJ11bMF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogcmVndWxhckV2ZW50WydAX0xpbmsnXSA/IHJlZ3VsYXJFdmVudFsnQF9MaW5rJ11bMF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiByZWd1bGFyRXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLlJFR1VMQVIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld1R5cGU6IHJlZ3VsYXJFdmVudFsnQF9WaWV3VHlwZSddID8gcmVndWxhckV2ZW50WydAX1ZpZXdUeXBlJ11bMF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddID8gcmVndWxhckV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUmVndWxhckV2ZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkgYXMgRXZlbnRbXSlcbiAgICAgICAgICAgICAgICAgIDogW10pLFxuICAgICAgICAgICAgICBdIGFzIEV2ZW50W10sXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgICB9LCB7fSBhcyBDYWxlbmRhcik7XG4gICAgICAgICAgcmVzKHsgLi4uYWxsRXZlbnRzLCBldmVudHM6IF8udW5pcUJ5KGFsbEV2ZW50cy5ldmVudHMsIChpdGVtKSA9PiBpdGVtLnRpdGxlKSB9IGFzIENhbGVuZGFyKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4gICAgfSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBNEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDZSxNQUFNQSxNQUFNLFNBQVNDLGFBQUksQ0FBQ0QsTUFBTSxDQUFDO0lBRTlDRSxXQUFXLENBQUNDLFdBQTZCLEVBQUVDLE9BQWUsRUFBRTtNQUMxRCxLQUFLLENBQUNELFdBQVcsQ0FBQztN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