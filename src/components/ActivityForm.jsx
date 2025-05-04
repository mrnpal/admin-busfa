const ActivityForm = ({ newActivity, setNewActivity, handleAddActivity }) => {
    return (
      <form className="form" onSubmit={handleAddActivity}>
        <h2>Tambah Kegiatan</h2>
        <input
          type="text"
          name="title"
          placeholder="Judul"
          value={newActivity.title}
          onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
          required
        />
        <textarea
          name="description"
          placeholder="Deskripsi"
          value={newActivity.description}
          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
          required
        />
        <input
          type="date"
          name="date"
          value={newActivity.date}
          onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewActivity({ ...newActivity, image: e.target.files[0] })}
        />
        <button type="submit">Tambah</button>
      </form>
    );
  };
  
  export default ActivityForm;