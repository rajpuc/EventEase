export const updateFormData = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
  
      const reader = new FileReader();
  
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        resolve(reader.result); // base64 string
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
    });
};
  