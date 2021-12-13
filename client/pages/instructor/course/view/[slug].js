import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button } from "antd";
import { EditOutlined, CheckOutlined, UploadOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import Modal from "antd/lib/modal/Modal";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);

  //   Route
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    try {
      const { data } = await axios.get(`/api/course/${slug}`);
      setCourse(data);
    } catch (error) {
      console.log(error);
    }
  };

  //   Functions for adding lesson
  const handleAddLesson = (e) => {
    e.preventDefault();
    console.log(values);
  };

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append("video", file);

      const { data } = await axios.post("/api/course/video-upload", videoData, {
        onUploadProgress: (e) => {
          setProgress(Math.round(100 * e.loaded) / e.total);
        },
      });

      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (error) {
      setUploading(false);
      toast("Upload failed");
    }
  };

  const handleVideoRemove = async () => {
    try {
      setUploading(true);
      await axios.post("/api/course/video-remove", { video: values.video });
      setValues({ ...values, video: {} });
      setUploading(false);
      setUploadButtonText("Upload Video");
    } catch (error) {
      setUploading(false);
      toast("Remove video failed");
    }
  };

  return (
    <InstructorRoute>
      <div className="container-fluid pt-3">
        {course && (
          <div className="container-fluid pt-1">
            <div className="media pt-2">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />

              <div className="media-body pl-2">
                <div className="row">
                  <div className="col">
                    <h5 className="mt-2 text-primary">{course.name}</h5>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons && course.lessons.length} lessons
                    </p>
                    <p style={{ marginTop: "-15px", fontSize: "-10px" }}>
                      {course.category}
                    </p>
                  </div>
                  <div className="d-flex mt-4">
                    <Tooltip title="Edit">
                      <EditOutlined className="h5 pointer text-warning mr-4" />
                    </Tooltip>
                    <Tooltip title="Publish" className="h5 pointer text-danger">
                      <CheckOutlined />
                    </Tooltip>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <ReactMarkdown children={course.description} />
                  </div>
                </div>

                <div className="row">
                  <Button
                    onClick={() => setVisible(true)}
                    className="col-md-6 offset-md-3 text-center"
                    type="primary"
                    shape="round"
                    icon={<UploadOutlined />}
                    size="large"
                  >
                    Add lesson
                  </Button>
                </div>

                <Modal
                  title="+ Add lesson"
                  centered
                  visible={visible}
                  onCancel={() => setVisible(false)}
                  footer={null}
                >
                  <AddLessonForm
                    values={values}
                    setValues={setValues}
                    uploading={uploading}
                    setUploading={setUploading}
                    uploadButtonText={uploadButtonText}
                    progress={progress}
                    handleAddLesson={handleAddLesson}
                    handleVideo={handleVideo}
                    handleVideoRemove={handleVideoRemove}
                  />
                </Modal>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
