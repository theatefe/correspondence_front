import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js"
import draftToHtml from "draftjs-to-html"
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

// Reactstrap components
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Form,
  Label,
  Input,
  FormFeedback,
  Button,
} from "reactstrap"

// API functions
import DetailLetterApi from "../../api/user/letter/DetailLetter"
import updateApi from "../../api/user/letter/update"

const LetterEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))

  // State for letter data
  const [letter, setLetter] = useState({
    id: null,
    number: "",
    date: "",
    status: "",
    title: "",
    content: "",
    signature: "",
    attachments: [],
  })

  // Form states
  const [formValues, setFormValues] = useState({
    correspondenceTitle: "",
    selectedGroup: null,
    selectedReceiver: null,
    classification: { label: "عادی", value: 1 },
    urgency: { label: "عادی", value: 1 },
    description: "",
  })

  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [uploadFiles, setUploadFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})

  // get detail letter **********************************
  const getDetailLetter = async () => {
    try {
      const response = await DetailLetterApi(token, id)
      const data = response.data
      setLetter({
        id: data.id,
        number: data.number,
        date: data.createDate,
        status: data.status,
        title: data.title,
        content: data.content,
        signature: data.Signature?.mediaUrl,
        attachments: data.attachments,
      })

      // Initialize form values
      setFormValues({
        correspondenceTitle: data.title,
        selectedGroup: {
          value: data.signer.id,
          label: data.signer.fullName,
        },
        selectedReceiver: {
          value: data.reciver.id,
          label: data.reciver.fullName,
        },
        classification: {
          label: data.set,
          value: data.set === "محرمانه" ? 1 : 0,
        },
        urgency: {
          label: data.priority,
          value: data.priority === "فوری" ? 2 : data.priority === "آنی" ? 3 : 1,
        },
        description: "",
      })

      // Initialize editor content
      if (data.content) {
        const contentState = convertFromRaw(JSON.parse(data.content))
        setEditorState(EditorState.createWithContent(contentState))
      }

      // Initialize attachments
      if (data.attachments && data.attachments.length > 0) {
        setUploadFiles(
          data.attachments.map(file => ({
            id: file.id,
            title: file.name,
            file: file.url,
            formattedSize: formatBytes(file.size),
          }))
        )
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching letter:", error)
      toastr.error("خطا در دریافت اطلاعات نامه")
      navigate("/letterCartabl")
    }
  }
  // Handle form submission ******************************
  const handleSubmit = async e => {
    e.preventDefault()
    if (validateFields()) {
      setLoading(true)

      const rawContentState = convertToRaw(editorState.getCurrentContent())
      const contentAsJSON = JSON.stringify(rawContentState)

      const data = {
        id: letter.id,
        title: formValues.correspondenceTitle,
        content: contentAsJSON,
        signerId: formValues.selectedGroup.value,
        reciverUserId: formValues.selectedReceiver.value,
        priority: formValues.urgency.value,
        confidentiality: formValues.classification.value,
        LetterMedias: uploadFiles.map(file => ({
          mediaId: file.id,
          title: file.title,
        })),
      }

      try {
        const result = await updateApi(token, data)
        if (result.status === 200) {
          toastr.success("نامه با موفقیت به‌روزرسانی شد")
          navigate("/letterCartabl")
        } else {
          toastr.error("خطا در به‌روزرسانی نامه")
        }
      } catch (error) {
        console.error("Error updating letter:", error)
        toastr.error("خطا در به‌روزرسانی نامه")
      } finally {
        setLoading(false)
      }
    }
  }
  // Validation function
  const validateFields = () => {
    const newErrors = {}
    if (!formValues.correspondenceTitle) {
      newErrors.correspondenceTitle = "موضوع نامه را وارد کنید"
    }
    if (!formValues.selectedGroup) {
      newErrors.selectedGroup = "امضاکننده را انتخاب کنید"
    }
    if (!formValues.selectedReceiver) {
      newErrors.selectedReceiver = "گیرنده را انتخاب کنید"
    }
    if (!editorState.getCurrentContent().hasText()) {
      newErrors.editorContent = "متن نامه را وارد کنید"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  // Format bytes
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  useEffect(() => {
    getDetailLetter()
  }, [id, token, navigate])

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>در حال دریافت اطلاعات نامه...</p>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  return (
    <div className="page-content">
      <Container fluid>
        <h4 className="card-title font-size-22">ویرایش نامه</h4>

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  {/* موضوع نامه */}
                  <FormGroup>
                    <Label>موضوع نامه</Label>
                    <Input
                      type="text"
                      value={formValues.correspondenceTitle}
                      onChange={e =>
                        setFormValues({
                          ...formValues,
                          correspondenceTitle: e.target.value,
                        })
                      }
                      invalid={!!errors.correspondenceTitle}
                      disabled={letter.status === "شماره شده"}
                    />
                    <FormFeedback>{errors.correspondenceTitle}</FormFeedback>
                  </FormGroup>

                  {/* ویرایشگر متن */}
                  <FormGroup>
                    <Label>متن نامه</Label>
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={setEditorState}
                      toolbar={{
                        options: ["inline", "list", "textAlign", "history"],
                        inline: { options: ["bold", "italic", "underline"] },
                      }}
                      readOnly={letter.status === "شماره شده"}
                      editorStyle={
                        letter.status === "شماره شده"
                          ? {
                              opacity: 0.7,
                              backgroundColor: "#f5f5f5",
                              cursor: "not-allowed",
                            }
                          : {}
                      }
                    />
                    {errors.editorContent && (
                      <div className="text-danger small mt-1">
                        {errors.editorContent}
                      </div>
                    )}
                  </FormGroup>

                  {/* دکمه‌های اقدام */}
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      color="secondary"
                      onClick={() => navigate("/letterCartabl")}
                    >
                      بازگشت
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={loading || letter.status === "شماره شده"}
                    >
                      {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default LetterEdit
