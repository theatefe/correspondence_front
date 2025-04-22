import React from "react"
import { Button } from "reactstrap"

function LetterActionButtons({
  loading,
  isButtonDisabled,
  statusLabel,
  onSave,
  onDelete,
  onSign,
  onNumber,
  onRefer,
}) {
  return (
    <div className="row justify-content-between">
      <div className="col-auto">
        <div className="row">
          {/* <div className="col-auto">
                          <button className="d-flex align-items-center btn btn-primary waves-effect waves-light">
                            <i className="bx bx-plus font-size-18 ms-lg-1"></i>
                            <span className="d-none d-sm-block">جدید</span>
                          </button>
                        </div> */}
          <div className="col-auto px-1 px-lg-2">
            <button
              className="d-flex align-items-center btn btn-primary withText px-2 py-2"
              disabled={loading || isButtonDisabled} // دکمه غیرفعال می‌شود
              onClick={onSave}
            >
              {loading ? (
                <>
                  <i className="bx bx-loader bx-spin font-size-18 ms-lg-1"></i>
                  <span className="d-none d-sm-block">در حال ذخیره...</span>
                </>
              ) : (
                <>
                  <i className="bx bx-save font-size-18 ms-lg-1"></i>
                  <span className="d-none d-sm-block">ذخیره</span>
                </>
              )}
            </button>
          </div>
          <div className="col-auto px-1">
            <button
              className="d-flex align-items-center btn letterBtn_topNav px-2 py-2 textFree"
              disabled={statusLabel !== "ثبت شده"}
              onClick={onDelete}
            >
              <i className="bx bx-trash font-size-18"></i>
            </button>
          </div>
          {/* <div className="col-auto px-1">
                          <button
                            className="d-flex align-items-center btn letterBtn_topNav px-2 py-2 textFree"
                            onClick={printInvoice}
                            disabled={statusLabel !== "ثبت شده"}
                          >
                            <i className="bx bx-printer font-size-18"></i>
                          </button>
                        </div> */}
          <div className="col-auto px-1 px-lg-2">
            <button
              className="d-flex align-items-center btn letterBtn_topNav px-2 py-2 withText noHover"
              onClick={onSign}
              disabled={statusLabel !== "ثبت شده"}
            >
              <i className="fas fa-file-signature ms-lg-1"></i>
              <span className="d-none d-sm-block">امضا</span>
            </button>
          </div>
          <div className="col-auto px-1 px-lg-2">
            <button
              className="d-flex align-items-center btn letterBtn_topNav px-2 py-2 withText noHover"
              onClick={onNumber}
              disabled={statusLabel !== "امضاشده"}
            >
              <i className="mdi mdi-numeric ms-lg-1 font-size-22"></i>
              <span className="d-none d-sm-block">ثبت شماره</span>
            </button>
          </div>
          <div className="col-auto px-1 px-lg-2">
            <button
              className="d-flex align-items-center btn letterBtn_topNav px-2 py-2 withText noHover"
              onClick={onRefer}
              disabled={isButtonDisabled}
            >
              <i className="bx bx-send ms-lg-1 font-size-18"></i>
              <span className="d-none d-sm-block">ارجاع</span>
            </button>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center col-auto mt-3 mt-sm-0">
        {statusLabel != null ? (
          <span className="letterStatus_topNav">{statusLabel}</span>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default LetterActionButtons
