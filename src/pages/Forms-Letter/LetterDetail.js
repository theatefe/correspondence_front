import { React, useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom"
import moment from "moment-jalaali"
import { Container, Row } from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import Overview from "../Tables/CorrespondenceDetails/CorrespondenceOverview"
import DetailsSection from "../Tables/CorrespondenceDetails/CorrespondenceDetailsSection"

// api
import DetailLetterApi from "../../api/user/letter/DetailLetter"
import SeenTrackingApi from "../../api/user/letter/tracking/seen"

const Correspondenceindex = () => {
  document.title = "مشاهده نامه - مکاتبات"
  const { id, trackId } = useParams()
  const token = localStorage.getItem("token")
  const [letterDetail, setLetterDetail] = useState({})
  const [letterTrackings, setLetterTrackings] = useState([])
  const [loading, setLoading] = useState()
  // ********* Query ******************
  // seen letter tracking *************
  const seenLetterTracking = async () => {
    await SeenTrackingApi(token, { id: trackId })
  }
  // get detail letter ****************
  const getDetailLetter = async () => {
    const response = await DetailLetterApi(token, id)
    const item = response.data
    const jalaliCreated = item.createdAt
    const jalaliCreatedDate = moment(jalaliCreated).format("jYYYY/jMM/jDD")
    const letter = {
      id: item.id,
      content: item.content,
      set: item.confidentiality,
      sender:
        item.sender !== null
          ? {
              id: item.sender.id,
              fullName: item.sender.name + " " + item.sender.lastName,
            }
          : null,
      reciver:
        item.reciver !== null
          ? {
              id: item.reciver.id,
              fullName: item.reciver.name + " " + item.reciver.lastName,
            }
          : null,
      signer:
        item.signer != null
          ? {
              id: item.signer.id,
              fullName: item.signer.name + " " + item.signer.lastName,
            }
          : null,
      Signature: item.signatureStatus == "امضاشده" ? item.signature : null,
      createDate: jalaliCreatedDate,
      linked: item.attached != null ? item.attachType : "ندارد",
      number: item.number !== null ? item.number : null,
      priority: item.priority,
      title: item.title,
      type: item.type,
      checkAttachment: item.letterMedias.length < 1 ? "ندارد" : "دارد",
      attachments: item.letterMedias,
      status: item.status,
    }
    setLetterDetail(letter)
    setLetterTrackings(item.letterTrackings)
  }
  // useEffect *************************
  useEffect(() => {
    setLoading(true)
    if (trackId !== undefined) {
      seenLetterTracking()
    }
    getDetailLetter()
    setLoading(false)
  }, [])

  return !loading ? (
    <div className="page-content">
      <Container fluid>
        {/* Render Breadcrumbs */}
        <Breadcrumbs title="نامه ها" breadcrumbItem="مشاهده نامه" />
        <Row>
          <Overview
            letterDetail={letterDetail}
            setLetterDetail={setLetterDetail}
            trackings={letterTrackings}
            setLetterTrackings={setLetterTrackings}
          />
          <DetailsSection
            letterDetail={letterDetail}
            letterTransmition={letterTrackings}
          />
        </Row>
      </Container>
    </div>
  ) : (
    <></>
  )
}

export default Correspondenceindex
