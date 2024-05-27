module.exports = mongoose => {
    const DB = mongoose.model(
      "DB",
      mongoose.Schema(
        {
          title: String,
          description: String,
          published: Boolean
        },
        { timestamps: true }
      )
    );
  
    return DB;
  };