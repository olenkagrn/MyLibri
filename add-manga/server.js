// server.js

const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Error: SUPABASE_URL and SUPABASE_KEY environment variables are not set."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/add-manga", upload.single("image"), async (req, res) => {
  try {
    const { mangaName, author, category } = req.body;
    let imageUrl = null;

    if (!mangaName || !author || !category) {
      return res
        .status(400)
        .send("Missing required fields: manga name, author, or category.");
    }

    if (req.file) {
      const file = req.file;
      const fileName = `uploads/${Date.now()}-${file.originalname.replace(
        /\s+/g,
        "_"
      )}`;
      const bucketName = "manga-covers";

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error(
          "Error uploading image to Supabase Storage:",
          uploadError
        );
        return res
          .status(500)
          .send("Failed to upload image. Please try again.");
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (publicUrlData && publicUrlData.publicUrl) {
        imageUrl = publicUrlData.publicUrl;
      } else {
        console.warn(
          "Warning: Could not retrieve the public URL of the uploaded image."
        );
      }
    }

    const { data, error: insertError } = await supabase.from("manga").insert([
      {
        title: mangaName,
        author,
        category: [category],
        image: imageUrl,
      },
    ]);

    if (insertError) {
      console.error("Error inserting data into Supabase:", insertError);
      return res
        .status(500)
        .send(
          `Server error while adding manga: ${
            insertError.message || JSON.stringify(insertError)
          }`
        );
    }

    res.status(201).send("Manga successfully added!");
  } catch (error) {
    console.error("Unexpected error in /add-manga route:", error);
    res.status(500).send("An unexpected server error occurred.");
  }
});

app.get("/manga", async (req, res) => {
  try {
    const { category } = req.query;
    let query = supabase.from("manga").select("*");

    if (category) {
      query = query.contains("category", [category]);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error retrieving manga:", error);
      return res
        .status(500)
        .send(`Server error: ${error.message || JSON.stringify(error)}`);
    }

    res.json(data);
  } catch (error) {
    console.error("Unexpected error in /manga route:", error);
    res.status(500).send("An unexpected server error occurred.");
  }
});

app.put("/update-manga/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mangaName, author, category } = req.body;

    if (!mangaName || !author || !category) {
      return res
        .status(400)
        .send("Missing required fields for updating manga.");
    }

    const { data, error } = await supabase
      .from("manga")
      .update({
        title: mangaName,
        author,
        category: [category],
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating manga:", error);
      return res
        .status(500)
        .send(`Server error: ${error.message || JSON.stringify(error)}`);
    }

    if (data.length === 0) {
      return res.status(404).send("Manga not found.");
    }

    res
      .status(200)
      .json({ message: "Manga successfully updated!", manga: data[0] });
  } catch (error) {
    console.error("Unexpected error in /update-manga route:", error);
    res.status(500).send("An unexpected server error occurred.");
  }
});

app.delete("/delete-manga/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase.from("manga").delete().eq("id", id);

    if (error) {
      console.error("Error deleting manga:", error);
      return res.status(500).json({
        error: `Failed to delete manga: ${
          error.message || JSON.stringify(error)
        }`,
      });
    }

    res.status(200).json({ message: "Manga successfully deleted" });
  } catch (error) {
    console.error("Unexpected error in /delete-manga route:", error);
    res.status(500).send("An unexpected server error occurred.");
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Manga Add Form!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
