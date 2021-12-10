import { Button, Select, Avatar, Badge } from "antd";
import React, { Children } from "react";

const { Option } = Select;

function CourseCreateForm({
  handleSubmit,
  handleChange,
  handleImage,
  values,
  setValues,
  preView,
  uploadButtonText,
  handleRemoveImage,
}) {
  const children = [];
  for (let i = 9.99; i < 100.99; i++) {
    children.push(<Option key={i.toFixed(2)}>{i.toFixed(2)}</Option>);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group pt-3">
        <textarea
          name="description"
          cols="7"
          row="7"
          value={values.description}
          className={"form-control"}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-row pt-3">
        <div className="col">
          <div className="form-group">
            <Select
              style={{ width: "100%" }}
              size="large"
              value={values.paid}
              onChange={(event) => setValues({ ...values, paid: !values.paid })}
            >
              <Option value={true}>Paid</Option>
              <Option value={false}>Free</Option>
            </Select>
          </div>
        </div>

        {values.paid && (
          <div className="form-group">
            <Select
              style={{ width: "100%" }}
              size="large"
              defaultValue={"9.99"}
            >
              {children}
            </Select>
          </div>
        )}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="category"
          className="form-control"
          placeholder="Category"
          value={values.category}
          onChange={handleChange}
        />
      </div>

      <div className="form-row pt-3">
        <div className="col">
          <div className="form-row">
            <label className="btn btn-outline-secondary d-block w-100 text-left">
              {uploadButtonText}
              <input
                type="file"
                name="image"
                onChange={handleImage}
                accept="image/*"
                hidden
              />
            </label>
          </div>
        </div>

        {preView && (
          <div className="col-md-6">
            <Badge count="x" className="pointer" onClick={handleRemoveImage}>
              <Avatar width={500} src={preView} />
            </Badge>
          </div>
        )}
      </div>

      <div className="row pt-3">
        <div className="col">
          <Button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={values.upload || values.loading}
            loading={values.loading}
            type="primary"
            size="large"
            shape="round"
          >
            {values.loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default CourseCreateForm;
