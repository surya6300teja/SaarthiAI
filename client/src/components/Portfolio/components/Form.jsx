import FormGroup from "./Bootstrap/FormGroup";
import SocialMedia from "./Bootstrap/SocialMedia";
import AwardList from "./Form/Awards/AwardList";
import EducationList from "./Form/Education/EducationList";
import ExperienceList from "./Form/Experience/ExperienceList";
import InterestList from "./Form/Interests/InterestList";
import ProjectList from "./Form/Projects/ProjectList";
import SkillsList from "./Form/Skills/SkillsList";
import { SectionTitle } from "./sectionTitle/sectionTitle";

const Form = ({ FormData, onChange, isExperienceEnabled, isEducationEnabled, isSkillEnabled, isInterestEnabled, isAwardsEnabled,
  isProjectEnabled, toggleProject, toggleExperience, toggleEducation, toggleSkill, toggleInterest, toggleAward }) => {
  const Desc = {
    FullName: [
      "text",
      "Full Name",
      "This is your full name. This has been generated using your first and last names.",
    ],
    FirstName: [
      "text",
      "First Name",
      "Please enter your first name or given name.",
    ],
    LastName: ["text", "Last Name", "Please enter your last name or surname"],
    Thubmnail: [
      "text",
      "Your Photo",
      "Please upload your photo in a CDN(Ex. Imgur) and paste the direct image URL here.",
    ],
    URL: [
      "text",
      "Website / Resume Link",
      "Please enter the URL of your website, where this page is going to be hosted",
    ],
    Keywords: [
      "text",
      "Keywords i.e. frontend developer",
      "If someone wants to search for you, what keywords should they use?",
    ],
    Description: ["text", "About you", "Write something nice about you."],
    
    Address: [
      "text",
      "Where are you?",
      "Type in your full address to get kidnapped!",
    ],
    Phone: [
      "text",
      "Phone Number",
      "Please enter your phone number, so we can call you in the midnight!",
    ],
    Email: ["text", "Email Address", "Tell us your primary email address"],

    Socials: {
      Facebook: [
        "text",
        "Facebook Id",
        "Please enter your Facebook handle, so that we can follow your cat videos and food pics!",
      ],
      WhatsApp: [
        "text",
        "WhatsApp Number",
        "Please enter your WhatsApp number, so that we can send you 1000 'Good Morning' messages every day!",
      ],
      Instagram: [
        "text",
        "Instagram Username",
        "Please enter your Instagram username, so that we can double-tap all your photos!",
      ],
      Twitter: [
        "text",
        "Twitter Handle",
        "Please enter your Twitter handle, so that we can retweet your witty thoughts!",
      ],
      LinkedIn: [
        "text",
        "LinkedIn ID",
        "Please enter your LinkedIn ID, so that we can congratulate you on your 'work anniversaries'!",
      ],
      GitHub: [
        "text",
        "GitHub Username",
        "Please enter your GitHub username, so that we can fork your repositories!",
      ],
      StackOverflow: [
        "text",
        "StackOverflow Profile",
        "Please enter your StackOverflow profile, so that we can ask you to solve our coding dilemmas!",
      ],
    },
  };

  const getBorderColor = (fd) => {
    if (FormData[fd].length != 0 && fd !== "Colour") {
      return "border-indigo-500"; // Updated to match theme
    }
    return "border-gray-200";
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-black-800">Basic Information</h1>
        {Object.keys(FormData).map((fd) =>
          fd !== "Socials" ? (
            Object.keys(Desc).includes(fd) && (
              <FormGroup
                key={fd}
                Label={Desc[fd][1]}
                Type={Desc[fd][0]}
                Id={fd}
                Desc={Desc[fd][2]}
                Value={FormData[fd]}
                Placeholder={`Enter ${Desc[fd][1]}`}
                onChange={fd === "FullName" ? () => {} : onChange}
                readOnly={fd === "FullName" ? true : undefined}
                borderColor={getBorderColor(fd)}
                className="bg-white rounded-lg focus:ring-2 focus:ring-indigo-200"
              />
            )
          ) : (
            <SocialMedia
              MediaData={Desc[fd]}
              value={FormData[fd]}
              onChange={fd === "FullName" ? () => {} : onChange}
              className="bg-white rounded-lg focus:ring-2 focus:ring-indigo-200"
            />
          )
        )}
      </div>

      {/* Experience Section */}
      <div className={`rounded-lg border ${isExperienceEnabled ? "border-gray-200 bg-white" : "border-gray-100 bg-white-50"} p-6`}>
        <div className="space-y-4">
          <SectionTitle initialTitle="Experience" titleType="experience"/>
          <ExperienceList />
        </div>
      </div>

      {/* Education Section */}
      <div className={`rounded-lg border ${isEducationEnabled ? "border-gray-200 bg-white" : "border-gray-100 bg-white-50"} p-6`}>
        <div className="space-y-4">
          <SectionTitle initialTitle="Education" titleType='education'/>
          <EducationList />
        </div>
      </div>

      {/* Skills Section */}
      <div className={`rounded-lg border ${isSkillEnabled ? "border-gray-200 bg-white" : "border-gray-100 bg-white-50"} p-6`}>
        <div className="space-y-4">
          <SectionTitle initialTitle="Skills" titleType="skills"/>
          <SkillsList />
        </div>
      </div>

      {/* Interests Section */}
      <div className={`rounded-lg border ${isInterestEnabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50"} p-6`}>
        <div className="space-y-4">
          <SectionTitle initialTitle="Interests" titleType="interests"/>
          <InterestList />
        </div>
      </div>

      {/* Awards Section */}
      <div className={`rounded-lg border ${isAwardsEnabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50"} p-6`}>
        <div className="space-y-4">
          <SectionTitle initialTitle="Awards" titleType="awards"/>
          <AwardList />
        </div>
      </div>

      {/* Projects Section */}
      <div className={`rounded-lg border ${isProjectEnabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50"} p-6`}>
        <div className="space-y-4">
          <SectionTitle initialTitle="Projects" titleType="projects"/>
          <ProjectList />
        </div>
      </div>
    </div>
  );
};

export default Form;
