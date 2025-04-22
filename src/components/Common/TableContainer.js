import React, { Fragment } from "react"
import PropTypes from "prop-types"
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useRowSelect,
  desc, asc
} from "react-table"
import { Table, Row, Col, Button, Input, CardBody } from "reactstrap"
import { Filter, DefaultColumnFilter } from "./filters"
import JobListGlobalFilter from "../../components/Common/GlobalSearchFilter"
import removeImage from "../../assets/images/icons8-remove-from-inbox-100.png";

// i18n
import i18n from "../../i18n"
import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isJobListGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)

  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Row className="justify-content-center justify-content-sm-between mx-0">
        {/* Search table */}
        <Col className="col-12 col-sm-auto px-0">
          <div className="search-box me-xxl-0 me-0 ms-0 mx-0 my-xxl-0 d-inline-block">
            <div className="position-relative">
              <label htmlFor="search-bar-0" className="search-label mb-0">
                <span id="search-bar-0-label" className="sr-only">
                  Search this table
                </span>
                <input
                  onChange={e => {
                    setValue(e.target.value)
                    onChange(e.target.value)
                  }}
                  id="search-bar-0"
                  type="text"
                  className="form-control"
                  placeholder={`${count} ${t("record")}`}
                  value={value || ""}
                />
              </label>
              <i className="bx bx-search-alt search-icon"></i>
            </div>
          </div>
        </Col>
      </Row>

      {isJobListGlobalFilter && <JobListGlobalFilter />}
    </React.Fragment>
  )
}

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isJobListGlobalFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  mokatebatTableBtn,
  simpleSearchBox,
  customPageSize,
  className,
  customPageSizeOptions,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortBy: [
          {
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  )

  const { t } = useTranslation()

  const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
  }

  const onChangeInSelect = event => {
    setPageSize(Number(event.target.value))
  }

  const onChangeInInput = event => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0
    gotoPage(page)
  }

  return (
    <Fragment>
      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    key={column.id}
                    className={
                      column.flag == "true"
                        ? "cewnteredTh"
                        : column.flag == "checkBox"
                          ? "checkBoxWidth"
                          : ""
                    }
                  >
                    <div className="mb-0" {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}

                    </div>
                    {/* {column.flag !== 'checkBox' && (
                      <Filter
                        column={column}
                        className={column.id === "sender" ? "hide-filter" : ""}
                      />
                    )}{" "} */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {data.length > 0 ? (
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row)
                const isUnread = row.original.read // Check if the message is unread

                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr
                      className={isUnread ? "unreadMsg" : ""} // Add the "unreadMsg" class conditionally
                    >
                      {row.cells.map((cell, index) => {
                        return (
                          <td
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                            key={index}
                            {...cell.getCellProps()}
                          >
                            {/* Conditionally render a badge for unread messages */}
                            {index === 0 && isUnread && (
                              <span className="customeBadgeUnread"></span>
                            )}

                            {cell.render("Cell")}
                          </td>
                        )
                      })}
                    </tr>
                  </Fragment>
                )
              })}
            </tbody>) : (<> <tbody><tr>
              <td className="text-center" colSpan={13}>
                <img src={removeImage} width={50} /><br /><span>داده ای موجود نیست</span></td>
            </tr></tbody></>)}
        </Table>
      </div>

      <Row className="justify-content-center justify-content-sm-between align-items-center">
        <Col className="col col-sm-3 col-md-2 col-lg-2 col-xl-1">
          <select
            className="form-select left my-2 my-sm-0 "
            dir="ltr"
            value={pageSize}
            onChange={onChangeInSelect}
          // style={{ width: 100 }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {t("Show")} {pageSize}
              </option>
            ))}
          </select>
        </Col>

        <Col className="col-auto col-sm-auto">
          <Row className="justify-content-center">
            <Col className="col-auto">
              <div className="d-flex gap-1">
                <Button
                  className="bg-secondary bg-soft border-0"
                  color=""
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  {"<<"}
                </Button>
                <Button
                  className="bg-secondary bg-soft border-0"
                  color=""
                  onClick={previousPage}
                  disabled={!canPreviousPage}
                >
                  {"<"}
                </Button>
              </div>
            </Col>
            <Col className="col-auto d-none d-md-block my-auto">
              {t("Page")}{" "}
              <strong>
              {pageIndex + 1} {t("From")} {pageOptions.length}
              </strong>
            </Col>
            <Col className="col-auto px-0">
              <Input
                type="number"
                min={1}
                style={{ width: 50 }}
                max={pageOptions.length}
                defaultValue={pageIndex + 1}
                onChange={onChangeInInput}
              />
            </Col>

            <Col className="col-auto">
              <div className="d-flex gap-1">
                <Button
                  className="bg-secondary bg-soft border-0"
                  color="primary"
                  onClick={nextPage}
                  disabled={!canNextPage}
                >
                  {">"}
                </Button>
                <Button
                  className="bg-secondary bg-soft border-0"
                  color="primary"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {">>"}
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  )
}

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default withTranslation()(TableContainer)
