import React from "react"
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap"
import classnames from "classnames"
import Select from "react-select"
import { Editor } from "react-draft-wysiwyg"

function LetterTabsWithContent({
  t,
  customActiveTab,
  toggleCustom,
  formValues,
  errors,
  editorState,
  handleTitleChange,
  handleTitleBlur,
  handleSelectChange,
  handleSelectReciver,
  handleInputChange,
  handleEditorChange,
  usersList,
  loading,
  uploadFiles,
  handleFileChange,
  handleRemoveFile,
  userInfo,
}) {
  return (
    <>
      <Nav tabs className="nav-tabs-custom nav-justified">
        <NavItem>
          <NavLink
            style={{ cursor: "pointer" }}
            className={classnames({ active: customActiveTab === "1" })}
            onClick={() => toggleCustom("1")}
          >
            <span className="d-block d-lg-none">
              <i className="fas fa-home"></i>
            </span>
            <span className="d-none d-sm-block">{t("مشخصات")}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            style={{ cursor: "pointer" }}
            className={classnames({ active: customActiveTab === "2" })}
            onClick={() => toggleCustom("2")}
          >
            <span className="d-block d-sm-none">
              <i className="far fa-user"></i>
            </span>
            <span className="d-none d-sm-block">{t("متن")}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            style={{ cursor: "pointer" }}
            className={classnames({ active: customActiveTab === "3" })}
            onClick={() => toggleCustom("3")}
          >
            <span className="d-block d-sm-none">
              <i className="far fa-envelope"></i>
            </span>
            <span className="d-none d-sm-block">{t("پیوست")}</span>
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent
        activeTab={customActiveTab}
        className="position-relative text-muted p-3"
      >
        <TabPane tabId="1">
          {/* تب مشخصات - می‌تونی این بخش رو به LetterInfoForm جداگانه وصل کنی */}
          <Form>
            <Row className="pb-5">
              <Col md="12">
                <FormGroup>
                  <Label htmlFor="correspondenceTitle">
                    {t("موضوع")} <span className="requareForm">*</span>
                  </Label>
                  <Input
                    name="correspondenceTitle"
                    type="text"
                    id="correspondenceTitle"
                    value={formValues.correspondenceTitle}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    invalid={!!errors.correspondenceTitle}
                    placeholder="موضوع نامه را وارد کنید"
                  />
                  {errors.correspondenceTitle && (
                    <FormFeedback>{errors.correspondenceTitle}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              {/* امضاکننده و گیرنده و سایر فیلدها به همین شکل ادامه پیدا می‌کنن */}
            </Row>
          </Form>
        </TabPane>

        <TabPane tabId="2">
          <Row>
            <Col md="12">
              <FormGroup>
                <Label htmlFor="correspondenceEditor">
                  {t("متن")} <span className="requareForm">*</span>
                </Label>
                <Editor
                  editorState={editorState}
                  onEditorStateChange={handleEditorChange}
                  toolbar={{
                    options: ["inline", "list", "textAlign", "history"],
                    inline: { options: ["bold", "italic", "underline"] },
                    list: { inDropdown: false },
                    textAlign: { inDropdown: false },
                    history: { inDropdown: false },
                  }}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                />
                {errors.editorContent && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "11px" }}
                  >
                    {errors.editorContent}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </TabPane>

        <TabPane tabId="3">
          <FormGroup>
            <Label htmlFor="correspondenceAttachments" className="form-label">
              {t("Attachment")}
            </Label>
            <Input
              className="form-control"
              type="file"
              id="correspondenceAttachments"
              multiple
              onChange={handleFileChange}
            />
            {uploadFiles.map((file, index) => (
              <Row className="" key={index}>
                <div className="col">
                  <div
                    className="card h-100 shadow-sm border border-muted"
                    style={{ maxHeight: "67px" }}
                  >
                    <div className="d-flex align-items-center justify-content-between p-2">
                      <img
                        src={"/path/to/attachFile.png"}
                        alt={file.name}
                        style={{
                          height: "30px",
                          width: "30px",
                          objectFit: "scale-down",
                        }}
                      />
                      <h6
                        className="card-title text-truncate mb-0 flex-grow-1"
                        style={{ fontSize: "14px" }}
                      >
                        {file.title}
                      </h6>
                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => alert(file.id)}
                        style={{ width: "40px", height: "40px" }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-primary">
                        {file.formattedSize}
                      </span>
                    </div>
                  </div>
                </div>
              </Row>
            ))}
          </FormGroup>
        </TabPane>
      </TabContent>
    </>
  )
}

export default LetterTabsWithContent
