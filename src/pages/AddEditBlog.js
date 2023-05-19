import React, { useState, useEffect } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const initialState = {
	title: "",
	tags: [],
	trending: "no",
	category: "",
	description: "",
	likes: [],
	comments: [],
};

const categoryOption = [
	"Fashion",
	"Technology",
	"Food",
	"Politics",
	"Sports",
	"Business",
];

const AddEditBlog = ({ user, setActive }) => {
	const [form, setForm] = useState(initialState);
	const [file, setFile] = useState(null);
	const [progress, setProgress] = useState(null);

	const {id} = useParams()

  const navigate = useNavigate()

	const { title, tags, category, trending, description } = form;

	useEffect(() => {
		const uploadFile = () => {
			let ext = file.name.split(".").pop()
			const filename = Date.now() + "." + ext
			const storageRef = ref(storage, filename);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log("Upload is " + progress + "% done");
					setProgress(progress);
					switch (snapshot.state) {
						case "paused":
							console.log("Upload is paused");
							break;
						case "running":
							console.log("Upload is running");
							break;
						default:
							break;
					}
				},
				(error) => {
					console.log(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(
						(downloadUrl) => {
							toast.info("Image uploaded successfully!")
							setForm((prev) => ({
								...prev,
								imgUrl: downloadUrl,
							}));
						}
					);
				}
			);
		};
		file && uploadFile();
	}, [file]);

	useEffect(() => {
		id && getBlogDetail();
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	const getBlogDetail = async () => {
		const docRef = doc(db, "blogs", id);
		const snapshot = await getDoc(docRef);
		if(snapshot.exists()){
			setForm({...snapshot.data()})
		}
		setActive(null)
	}

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleTags = (tags) => {
		setForm({ ...form, tags });
	};

	const handleTrending = (e) => {
		setForm({ ...form, trending: e.target.value });
	};

	const onCategoryChange = (e) => {
		setForm({ ...form, category: e.target.value });
	};


	const handleSubmit = async (e) => {
		e.preventDefault();
		if (category && tags && title && description && trending) {
			if(!id){
				try {
					await addDoc(collection(db, "blogs"), {
						...form,
						timestamp: serverTimestamp(),
						author: user.displayName,
						userId: user.uid,
					});
					toast.success("Blog created successfully!")
				} catch (err) {
					console.log(err);
				}
			} else {
				try {
					await updateDoc(doc(db, "blogs", id), {
						...form,
						timestamp: serverTimestamp(),
						author: user.displayName,
						userId: user.uid,
					});
					toast.success("Blog updated successfully!")
				} catch (err) {
					console.log(err);
				}
			}
			
		} else{
			return toast.error("All fields must be filled!")
		}

    navigate("/");
	};

	return (
		<div class="container-fluid mb-4">
			<div class="container">
				<div class="col-12">
					<div class="text-center heading py-2">{id ? "Update Blog" : "Create Blog"}</div>
				</div>
				<div class="row h-100 justify-content-center align-items-center">
					<div class="col-10 col-md-8 col-lg-6">
						<form class="row blog-form" onSubmit={handleSubmit}>
							<div class="col-12 py-3">
								<input
									type="text"
									class="form-control input-text-box"
									placeholder="Title"
									name="title"
									value={title}
									onChange={handleChange}
								/>
							</div>
							<div class="col-12 py-3">
								<ReactTagInput
									tags={tags}
									placeholder="Tags"
									onChange={handleTags}
								/>
							</div>
							<div class="col-12 py-3">
								<p class="trending">Is it trending blog ?</p>
								<div class="form-check-inline mx-2">
									<input
										type="radio"
										class="form-check-input"
										name="radioOption"
										value="yes"
										checked={trending === "yes"}
										onChange={handleTrending}
									/>
									<label
										htmlFor="radioOption"
										class="form-check-label"
									>
										Yes&nbsp;
									</label>
									<input
										type="radio"
										class="form-check-input"
										name="radioOption"
										value="no"
										checked={trending === "no"}
										onChange={handleTrending}
									/>
									<label
										htmlFor="radioOption"
										class="form-check-label"
									>
										No
									</label>
								</div>
							</div>
							<div class="col-12 py-3">
								<select
									value={category}
									onChange={onCategoryChange}
									class="catg-dropdown"
                
								>
									<option>Please select category</option>
									{categoryOption.map((option, index) => (
										<option
											value={option || ""}
											key={index}
										>
											{option}
										</option>
									))}
								</select>
							</div>
							<div class="col-12 py-3">
								<textarea
									name="description"
									className="form-control description-box"
									placeholder="Description"
									value={description}
									cols="30"
									rows="10"
									onChange={handleChange}
								></textarea>
							</div>
							<div class="mb-3">
								<input
									type="file"
									class="form-control"
									onChange={(e) => setFile(e.target.files[0])}
								/>
							</div>
							<div class="col-12 py-3 text-center">
								<button
									class="btn btn-add"
									type="submit"
									disabled={
										progress !== null && progress < 100
									}
								>
									{id ? "Update" : "Submit"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddEditBlog;
