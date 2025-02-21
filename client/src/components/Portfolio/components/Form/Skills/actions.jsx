
export const REMOVE_SKILL = 'REMOVE_SKILL';

export const removeSkill = skill => ({
    type: REMOVE_SKILL,
    payload: {skill}
});


export const SELECT_SKILL='SELECT_SKILL'

export const selectSkill = (skill) => ({
    type: SELECT_SKILL,
    payload: { skill },
  });

// Export the functions properly
export const addSkill = (skills, newSkill) => {
    return [...skills, newSkill];
  };
  
  export const editSkill = (skills, index, updatedSkill) => {
    return skills.map((skill, i) => (i === index ? updatedSkill : skill));
  };
  
  export const deleteSkill = (skills, index) => {
    return skills.filter((_, i) => i !== index);
  };
  
  export const moveSkill = (skills, fromIndex, toIndex) => {
    const updatedSkills = [...skills];
    const [movedSkill] = updatedSkills.splice(fromIndex, 1);
    updatedSkills.splice(toIndex, 0, movedSkill);
    return updatedSkills;
  };
