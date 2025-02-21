import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import he from "he";
import Form from "./Form";
import Header from "./Bootstrap/Header";
import Preview from "./Preview";
import NavbarDesign1 from ".././components/options/navbar/NavbarDesign1";
import NavbarDesign2 from ".././components/options/navbar/NavbarDesign2";
import NavbarDesign3 from "./options/navbar/NavbarDesign3";
import NavbarDesign4 from ".././components/options/navbar/NavbarDesign4";
import ReactDOMServer from "react-dom/server";
import { connect } from "react-redux";
import TopPortion1 from "./options/about/option1";
import TopPortion2 from "./options/about/option2";
import TopPortion3 from "./options/about/option3";
import TopPortion4 from "./options/about/option4";
import Experience1 from "./options/experience/option1";
import Experience2 from "./options/experience/option2";
import Experience3 from "./options/experience/option3"; 
import Experience4 from "./options/experience/option4";
import EducationDesign1 from "./options/education/option1";
import EducationDesign2 from "./options/education/option2";
import EducationDesign3 from "./options/education/option3";
import EducationDesign4 from "./options/education/option4";
import GetInTouch from "./options/getInTouch/option1";
import Code from "./Code";
import { ArrowsPointingOutIcon, ArrowsPointingInIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const PortfolioCard = (
  state,
  {
    experienceTitle,
    skillsTitle,
    interestsTitle,
    awardsTitle,
    educationTitle,
    projectsTitle,
  }
) => {
  const projects =
    state.projects &&
    state.projects.length > 0 &&
    state.projects.map((projectObj) => projectObj.project);

  const data = {
    FormData: {
      FirstName: "",
      LastName: "",
      Thubmnail: "",
      URL: "",
      Description: "",
      Keywords: "",
      Address: "",
      Phone: "",
      Email: "",
      Colour: "#5538BC",
      Socials: {
        Facebook: "",
        WhatsApp: "",
        Instagram: "",
        Twitter: "",
        LinkedIn: "",
        GitHub: "",
        StackOverflow: "",
      },
    },
    fileDownloadUrl: null,
    PreviewMode: true,
  };
  const [initialState, setInitialState] = useState(data);

  const handleChange = (e) => {
    Object.keys(data.FormData).includes(e.target.name)
      ? setInitialState((prevState) => {
          return {
            ...prevState,
            FormData: {
              ...initialState.FormData,
              [e.target.name]: e.target.value,
            },
            PreviewMode: false,
          };
        })
      : setInitialState((prevState) => {
          return {
            ...prevState,
            FormData: {
              ...initialState.FormData,
              Socials: {
                ...initialState.FormData.Socials,
                [e.target.name]: e.target.value,
              },
            },
            PreviewMode: false,
          };
        });
  };

  const download = async () => {
    try {
      const codeFileElements = document.getElementsByClassName("codefile");

      // Check if the element exists
      if (codeFileElements.length > 0) {
        let output = he.decode(codeFileElements[0].innerHTML);

        const blob = new Blob([output]);
        const fileDownloadUrl2 = URL.createObjectURL(blob);

        setInitialState((prevState) => {
          return {
            ...prevState,
            fileDownloadUrl: fileDownloadUrl2,
          };
        });

        const resolveAfter3Sec = new Promise((resolve) =>
          setTimeout(resolve, 3000)
        );
        // Show a success toast and wait for it to close
        await toast.promise(resolveAfter3Sec, {
          pending: "Downloading...",
          success: "File downloaded successfully!",
          error: "An error occurred while downloading.",
          position: "top-right",
          autoClose: 3100, // Adjust the duration as needed
        });
      } else {
        throw new Error("Codefile element not found.");
      }
    } catch (error) {
      // Handle any errors that occur during the download process
      console.error("Download error:", error);
    }
  };

  const [isExperienceEnabled, setIsExperienceEnabled] = useState(true);
  const [isSkillEnabled, setIsSkillEnabled] = useState(true);
  const [isEducationEnabled, setIsEducationEnabled] = useState(true);
  const [isInterestEnabled, setisInterestEnabled] = useState(true);
  const [isAwardsEnabled, setisAwardsEnabled] = useState(true);
  const [isProjectEnabled, setisProjectEnabled] = useState(true);

  const toggleExperience = () => {
    setIsExperienceEnabled(!isExperienceEnabled);
  };

  const toggleEducation = () => {
    setIsEducationEnabled(!isEducationEnabled);
  };
  const toggleSkill = () => {
    setIsSkillEnabled(!isSkillEnabled);
  };
  const toggleInterest = () => {
    setisInterestEnabled(!isInterestEnabled);
  };
  const toggleAward = () => {
    setisAwardsEnabled(!isAwardsEnabled);
  };
  const toggleProject = () => {
    setisProjectEnabled(!isProjectEnabled);
  };

  const [navbarDesign, setNavbarDesign] = useState("NavbarDesign1");

  const handleDesignChange = (design) => {
    setNavbarDesign(design);
  };

  const [topPortion, setTopPortion] = useState("Option1");
  const handleTopPortionChange = (design) => {
    setTopPortion(design);
  };
  let selectedTopPortionDesign;

  switch (topPortion) {
    case "Option1":
      selectedTopPortionDesign = ReactDOMServer.renderToString(
        <TopPortion1 {...initialState.FormData} />
      );
      break;
    case "Option2":
      selectedTopPortionDesign = ReactDOMServer.renderToString(
        <TopPortion2 {...initialState.FormData} />
      );
      break;
    case "Option3":
      selectedTopPortionDesign = ReactDOMServer.renderToString(
        <TopPortion3 {...initialState.FormData} />
      );
      break;
    case "Option4":
      selectedTopPortionDesign = ReactDOMServer.renderToString(
        <TopPortion4 {...initialState.FormData} />
      );
      break;
  }

  const [experienceSection, setExperienceSection] = useState("Option1");

  const handleExperienceChange = (design) => setExperienceSection(design);

  let selectedExperienceDesign;

  switch (experienceSection) {
    case "Option1":
      selectedExperienceDesign = ReactDOMServer.renderToString(
        <Experience1
          experienceTitle={state.experienceTitle}
          experience={state.experiences}
        />
      );
      break;
    case "Option2":
      selectedExperienceDesign = ReactDOMServer.renderToString(
        <Experience2
          experienceTitle={state.experienceTitle}
          experience={state.experiences}
        />
      );
      break;
    case "Option3": 
      selectedExperienceDesign = ReactDOMServer.renderToString(
        <Experience3
          experienceTitle={state.experienceTitle}
          experience={state.experiences}
        />
      );
      break;
      case "Option4": 
      selectedExperienceDesign = ReactDOMServer.renderToString(
        <Experience4
          experienceTitle={state.experienceTitle}
          experience={state.experiences}
        />
      );
      break;
    default:
      selectedExperienceDesign = ReactDOMServer.renderToString(
        <Experience1
          experienceTitle={state.experienceTitle}
          experience={state.experiences}
        />
      );
      break;
  }

  const [educationSection, setEducationSection] = useState("Option1");
  const handleEducationChange = (design) => {
    setEducationSection(design);
  };

  let selectedEducationDesign;
  switch (educationSection) {
    case "Option1":
      selectedEducationDesign = ReactDOMServer.renderToString(
        <EducationDesign1
          educationTitle={state.educationTitle}
          education={state.educations}
        />
      );
      break;
    case "Option2":
      selectedEducationDesign = ReactDOMServer.renderToString(
        <EducationDesign2
          educationTitle={state.educationTitle}
          education={state.educations}
        />
      );
      break;
    case "Option3":
      selectedEducationDesign = ReactDOMServer.renderToString(
        <EducationDesign3
          educationTitle={state.educationTitle}
          education={state.educations}
        />
      );
      break;
    case "Option4":
      selectedEducationDesign = ReactDOMServer.renderToString(
        <EducationDesign4
          educationTitle={state.educationTitle}
          education={state.educations}
        />
      );
      break;
  }

  let selectedNavbarDesign;
  switch (navbarDesign) {
    case "NavbarDesign1":
      selectedNavbarDesign = ReactDOMServer.renderToString(
        <NavbarDesign1
          FullName={`${initialState.FormData.FirstName} ${initialState.FormData.LastName}`}
          isEducationEnabled={isEducationEnabled}
          isExperienceEnabled={isExperienceEnabled}
          isSkillEnabled={isSkillEnabled}
          isAwardsEnabled={isAwardsEnabled}
          isInterestEnabled={isInterestEnabled}
          isProjectEnabled={isProjectEnabled}
          experienceTitle={experienceTitle}
          educationTitle={educationTitle}
          skillsTitle={skillsTitle}
          interestsTitle={interestsTitle}
          awardsTitle={awardsTitle}
          projectsTitle={projectsTitle}
        />
      );
      break;
    case "NavbarDesign2":
      selectedNavbarDesign = ReactDOMServer.renderToString(
        <NavbarDesign2
          FullName={`${initialState.FormData.FirstName} ${initialState.FormData.LastName}`}
          isEducationEnabled={isEducationEnabled}
          isExperienceEnabled={isExperienceEnabled}
          isSkillEnabled={isSkillEnabled}
          isAwardsEnabled={isAwardsEnabled}
          isInterestEnabled={isInterestEnabled}
          isProjectEnabled={isProjectEnabled}
          experienceTitle={experienceTitle}
          educationTitle={educationTitle}
          skillsTitle={skillsTitle}
          interestsTitle={interestsTitle}
          awardsTitle={awardsTitle}
          projectsTitle={projectsTitle}
        />
      );
      break;
    case "NavbarDesign3":
      selectedNavbarDesign = ReactDOMServer.renderToString(
        <NavbarDesign3
          FullName={`${initialState.FormData.FirstName} ${initialState.FormData.LastName}`}
          isEducationEnabled={isEducationEnabled}
          isExperienceEnabled={isExperienceEnabled}
          isSkillEnabled={isSkillEnabled}
          isAwardsEnabled={isAwardsEnabled}
          isInterestEnabled={isInterestEnabled}
          isProjectEnabled={isProjectEnabled}
          experienceTitle={experienceTitle}
          educationTitle={educationTitle}
          skillsTitle={skillsTitle}
          interestsTitle={interestsTitle}
          awardsTitle={awardsTitle}
          projectsTitle={projectsTitle}
        />
      );
      break;
    case "NavbarDesign4":
      selectedNavbarDesign = ReactDOMServer.renderToString(
        <NavbarDesign4
          FullName={`${initialState.FormData.FirstName} ${initialState.FormData.LastName}`}
          isEducationEnabled={isEducationEnabled}
          isExperienceEnabled={isExperienceEnabled}
          isSkillEnabled={isSkillEnabled}
          isAwardsEnabled={isAwardsEnabled}
          isInterestEnabled={isInterestEnabled}
          isProjectEnabled={isProjectEnabled}
          experienceTitle={experienceTitle}
          educationTitle={educationTitle}
          skillsTitle={skillsTitle}
          interestsTitle={interestsTitle}
          awardsTitle={awardsTitle}
          projectsTitle={projectsTitle}
        />
      );
      break;
    default:
      selectedNavbarDesign = ReactDOMServer.renderToString(
        <NavbarDesign1
          FullName={`${initialState.FormData.FirstName} ${initialState.FormData.LastName}`}
          isEducationEnabled={isEducationEnabled}
          isExperienceEnabled={isExperienceEnabled}
          isSkillEnabled={isSkillEnabled}
          isAwardsEnabled={isAwardsEnabled}
          isInterestEnabled={isInterestEnabled}
          isProjectEnabled={isProjectEnabled}
          experienceTitle={experienceTitle}
          educationTitle={educationTitle}
          skillsTitle={skillsTitle}
          interestsTitle={interestsTitle}
          awardsTitle={awardsTitle}
        />
      );
      break;
  }

  let getInTouchDesign = ReactDOMServer.renderToString(
    <GetInTouch {...initialState.FormData} />
  );

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const downloadHTML = () => {
    try {
      // Get the preview content directly from the DOM
      const previewContent = document.querySelector('.preview-content');
      if (!previewContent) {
        throw new Error('Preview content not found');
      }

      // Create a full HTML document
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${initialState.FormData.FirstName} ${initialState.FormData.LastName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.5;
      }
    </style>
  </head>
  <body class="bg-white">
    <div class="portfolio-container">
      ${previewContent.outerHTML}
    </div>
  </body>
</html>`;

      // Create and trigger download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `portfolio-${initialState.FormData.FirstName.toLowerCase()}-${initialState.FormData.LastName.toLowerCase()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Portfolio downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download portfolio. Please try again.');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      {/* All Design Options - Fixed at top */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Navbar Designs */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Navigation Style</label>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {['NavbarDesign1', 'NavbarDesign2', 'NavbarDesign3', 'NavbarDesign4'].map((design) => (
                <button
                  key={design}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                    navbarDesign === design 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleDesignChange(design)}
                >
                  {design.replace('NavbarDesign', 'Design ')}
                </button>
              ))}
            </div>
          </div>

          {/* Section Design Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* About Design Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Section Style</label>
              <div className="flex flex-wrap gap-2">
                {['Option1', 'Option2', 'Option3', 'Option4'].map((option) => (
                  <button
                    key={option}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      topPortion === option 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTopPortionChange(option)}
                  >
                    Style {option.replace('Option', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Design Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Section Style</label>
              <div className="flex flex-wrap gap-2">
                {['Option1', 'Option2', 'Option3', 'Option4'].map((option) => (
                  <button
                    key={option}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      experienceSection === option 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => handleExperienceChange(option)}
                  >
                    Style {option.replace('Option', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Education Design Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education Section Style</label>
              <div className="flex flex-wrap gap-2">
                {['Option1', 'Option2', 'Option3', 'Option4'].map((option) => (
                  <button
                    key={option}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      educationSection === option 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => handleEducationChange(option)}
                  >
                    Style {option.replace('Option', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Below Navigation */}
      <div className="container mx-auto px-4 py-4 flex-1">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-16rem)]">
          {/* Left Panel - Form */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full overflow-hidden">
              {/* Form content only - Design options moved to top */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 sticky top-0 bg-white py-2 z-10">Personal Information</h3>
                  <Form
                    FormData={{
                      FullName: `${initialState.FormData.FirstName} ${initialState.FormData.LastName}`,
                      ...initialState.FormData,
                    }}
                    onChange={handleChange}
                    inputClassName="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors duration-200 bg-white text-white placeholder-white-400"
                    labelClassName="block bg-white text-sm font-medium text-white-700 mb-1"
                    toggleClassName="relative bg-white inline-flex items-center cursor-pointer"
                    toggleSliderClassName="w-11 h-6 bg-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
                    isEducationEnabled={isEducationEnabled}
                    isExperienceEnabled={isExperienceEnabled}
                    isSkillEnabled={isSkillEnabled}
                    isInterestEnabled={isInterestEnabled}
                    isAwardsEnabled={isAwardsEnabled}
                    isProjectEnabled={isProjectEnabled}
                    toggleExperience={toggleExperience}
                    toggleEducation={toggleEducation}
                    toggleSkill={toggleSkill}
                    toggleInterest={toggleInterest}
                    toggleAward={toggleAward}
                    toggleProject={toggleProject}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className={`${
            isFullScreen 
              ? 'fixed inset-0 z-50 p-4 bg-gray-900/50 backdrop-blur-sm' 
              : 'w-full lg:w-1/2 flex flex-col'
          }`}>
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full overflow-auto relative ${
              isFullScreen ? 'w-full h-full max-w-7xl mx-auto' : ''
            }`}>
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                {/* Download HTML Button */}
                <button
                  onClick={downloadHTML}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 group"
                  title="Download HTML"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
                </button>

                {/* Full Screen Toggle Button */}
                <button
                  onClick={toggleFullScreen}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 group"
                  title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                >
                  {isFullScreen ? (
                    <ArrowsPointingInIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
                  ) : (
                    <ArrowsPointingOutIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
                  )}
                </button>
              </div>

              {/* Preview Content */}
              <div className="preview-content">
                <Preview
                  {...initialState.FormData}
                  FullName={`${initialState.FormData.FirstName} ${initialState.FormData.LastName}`}
                  EducationDesign={selectedEducationDesign}
                  ExperienceDesign={selectedExperienceDesign}
                  isEducationEnabled={isEducationEnabled}
                  isExperienceEnabled={isExperienceEnabled}
                  isSkillEnabled={isSkillEnabled}
                  isInterestEnabled={isInterestEnabled}
                  isAwardsEnabled={isAwardsEnabled}
                  isProjectEnabled={isProjectEnabled}
                  Navbar={selectedNavbarDesign}
                  getInTouch={getInTouchDesign}
                  TopPortion={selectedTopPortionDesign}
                  projectsTitle={projectsTitle}
                  projects={projects}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />

      {/* Add this CSS to your global styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
      `}</style>
    </div>
  );
};
const mapStateToProps = (state) => ({
  experiences: state.experiences,
  educations: state.educations,
  awards: state.awards,
  interests: state.interests,
  skills: state.skills.selectedSkills,
  experienceTitle: state.title.experienceTitle,
  skillsTitle: state.title.skillsTitle,
  interestsTitle: state.title.interestsTitle,
  awardsTitle: state.title.awardsTitle,
  educationTitle: state.title.educationTitle,
  projectsTitle: state.title.projectsTitle,
  projects: state.projects.items,
});

export default connect(mapStateToProps)(PortfolioCard);
