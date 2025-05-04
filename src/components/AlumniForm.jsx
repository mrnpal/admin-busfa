import React from 'react';

const AlumniForm = ({ newAlumni, setNewAlumni, handleAddAlumni }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlumni((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleAddAlumni}>
      <div>
        <label>Nama:</label>
        <input
          type="text"
          name="name"
          value={newAlumni.name || ""}  // default to empty string if undefined
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={newAlumni.email || ""}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Alamat:</label>
        <input
          type="text"
          name="address"
          value={newAlumni.address || ""}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Pekerjaan:</label>
        <input
          type="text"
          name="job"
          value={newAlumni.job || ""}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Nomor Telepon:</label>
        <input
          type="text"
          name="phone"
          value={newAlumni.phone || ""}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Tahun Lulus:</label>
        <input
          type="text"
          name="graduationYear"
          value={newAlumni.graduationYear || ""}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Tambah Alumni</button>
    </form>
  );
};

export default AlumniForm;
