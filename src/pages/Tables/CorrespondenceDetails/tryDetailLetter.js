import React from "react"
import { useParams } from "react-router-dom"
import { Container, Row } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import OverviewLinked from "./CorrespondenceLinkedView"
import LinkedSection from "./CorrespondenceLinkedSection"

const ViewLinkedLetter = () => {
  document.title = "مشاهده نامه - سامانه مکاتبات"
  const { id } = useParams()
  const token = localStorage.getItem("token")
  const [letterDetail, setLetterDetail] = React.useState({})
  const [xxx, setxxx] = React.useState([])
  const [letterTransmition, setLetterTransmition] = React.useState([])
  const [loading, setLoading] = React.useState()

  // get all transmitions
  const getAllTransmission = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/letter/get-transmition/${id}/`, config)
      .then(res => res.json())
      .then(result => {
        const list = result.map(item => {
          return item
        })
        setxxx(list)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
        setLoading(false) // Ensure setLoading is called even in case of an error
      })
  }
  // get detail letter
  const getDetailLetter = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/letter/detail-letter/${id}/`, config)
      .then(res => res.json())
      .then(result => {
        const item = result[0]
        const letter = {
          id: item.id,
          content: item.content,
          submiter:
            item.submiter != null
              ? {
                  id: item.submiter.id,
                  fullName:
                    item.submiter.first_name + " " + item.submiter.last_name,
                }
              : null,
          submiterSignature:
            item.submiter.profiles[0].signature != null
              ? item.submiter.profiles[0].signature
              : null,
          createDate: item.createDate.slice(0, 10),
          linked: item.linked != null ? item.linked.number : "ندارد",
          linkedMedia: item.linked != null ? item.linked.file : null,
          number: item.number,
          priority:
            item.priority == "1"
              ? "عادی"
              : item.priority == "2"
              ? "فوری"
              : item.priority == "3"
              ? "آنی"
              : "بدون الویت",
          title: item.title,
          type: item.type == "1" ? "عادی" : "محرمانه",
          checkAttachment: item.attachment.length < 1 ? "ندارد" : "دارد",
          attachments: item.attachment,
          file: item.file,
          state: item.state,
          transmissions: item.transmissions,
        }
        setLetterDetail(letter)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
        setLoading(false) // Ensure setLoading is called even in case of an error
      })
  }
  // get my transmission
  const getTransmission = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/letter/get-transmitter-trans/${id}/`, config)
      .then(res => res.json())
      .then(result => {
        const list = result.map(item => {
          return {
            id: item.id,
            sender:
              item.transmitter.first_name + " " + item.transmitter.last_name,
            reciver: item.receiver.first_name + " " + item.receiver.last_name,
            files: item.attach,
            status: item.status,
            description: item.description,
            createDate: item.createDate,
          }
        })
        setLetterTransmition(list)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
        setLoading(false) // Ensure setLoading is called even in case of an error
      })
  }
  // update seen latter
  const updateSeenLatter = () => {
    const url = `http://localhost:3000/letter/update-seen-Letter/${id}/`
    const headers = new Headers({
      Authorization: "Bearer " + token,
      accept: "application/json",
      "Content-Type": "application/json",
    })
    fetch(url, {
      headers: headers,
      method: "PUT",
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.log(err)
      })
  }
  // useEffect
  React.useEffect(() => {
    setLoading(true)
    updateSeenLatter()
    getAllTransmission()
    getDetailLetter()
    getTransmission()
  }, [])

  return !loading ? (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="نامه ها" breadcrumbItem="مشاهده نامه" />
          <Row>
            <OverviewLinked
              letterDetail={letterDetail}
              transmissions={letterDetail.transmissions}
            />
            <LinkedSection
              letterDetail={letterDetail}
              letterTransmition={letterTransmition}
            />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  ) : (
    <></>
  )
}

export default ViewLinkedLetter
