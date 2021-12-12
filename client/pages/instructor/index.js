import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../context";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { toast } from "react-toastify";
import { Avatar } from "antd";
import Link from "next/link";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const Instructor = () => {
  const {
    state: { user },
  } = useContext(Context);

  const [courses, setCourses] = useState("");

  console.log({ courses });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("/api/instructor-courses");
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourses();
  }, []);

  const myStyle = {
    marginTop: "-15px",
    fontSize: "10px",
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Instructor dashboard</h1>

      {courses &&
        courses.map((course) => {
          return (
            <>
              <div className="media pt-2" key={course._id}>
                <Avatar
                  size={80}
                  src={course.image ? course.image.Location : "/course.png"}
                />

                <div className="media-body pl-2">
                  <div className="row">
                    <div className="col">
                      <Link
                        href={`/instructor/course/view/${course.slug}`}
                        className="pointer"
                      >
                        <a className="h5 mt-2 text-primary">{course.name}</a>
                      </Link>
                      <p style={{ marginTop: "-10px" }}>
                        {course.lessons.length} Lessons
                      </p>

                      {course.lessons.length < 5 ? (
                        <p className={myStyle} className="text-warning">
                          At least 5 lessons are required to publish a course
                        </p>
                      ) : course.published ? (
                        <p className={myStyle} className="text-success">
                          Your course is living in the marketplace
                        </p>
                      ) : (
                        <p className={myStyle} className="text-success">
                          Your course is ready to be published
                        </p>
                      )}
                    </div>

                    <div className="col-md-3 text-center mt-3">
                      {course.published ? (
                        <div>
                          <CheckCircleOutlined className="h5 pointer text-success" />
                        </div>
                      ) : (
                        <div>
                          <CloseCircleOutlined className="h5 pointer text-warning" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
    </InstructorRoute>
  );
};

export default Instructor;
