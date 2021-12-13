import { Button, Progress, Tooltip } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import React from "react";

function AddLessonForm({
  values,
  setValues,
  handleAddLesson,
  uploading,
  uploadButtonText,
  progress,
  handleVideo,
  handleVideoRemove,
}) {
  return (
    <div className="container pt-3">
      <form onSubmit={handleAddLesson}>
        <input
          type="text"
          className="form-control square"
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          value={values.title}
          autoFocus
          required
        />

        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          value={values.content}
          placeholder="Content"
        ></textarea>

        <div className="d-flex justify-content-center">
          <label className="btn btn-dark btn-block text-left mt-3 w-100">
            {uploadButtonText}
            <input type="file" accept="video/*" hidden onChange={handleVideo} />
          </label>

          {!uploading && values.video.Location && (
            <Tooltip title="Remove">
              <span onClick={handleVideoRemove} className="pt-1 pl-3">
                <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
              </span>
            </Tooltip>
          )}
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            percent={progress}
            steps={10}
          />
        )}

        <Button
          className="col mt-3"
          type="primary"
          size="large"
          loading={uploading}
          onClick={handleAddLesson}
          shape="round"
        >
          Save
        </Button>
      </form>
    </div>
  );
}

export default AddLessonForm;
