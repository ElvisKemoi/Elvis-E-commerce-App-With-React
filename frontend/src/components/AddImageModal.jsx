import React, { useState } from "react";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	ModalCloseButton,
	Select,
	Button,
	Input,
	useToast,
} from "@chakra-ui/react";

import {
	addImage,
	addMiniImage,
	// uploadImageToCloudinary,
	uploadImageToServer,
} from "../services/ImageServices";

const AddImageModal = ({ isOpen, onClose, refresh, setRefresh }) => {
	const [category, setCategory] = useState("carousel");
	const [imageUrl, setImageUrl] = useState("");
	const toast = useToast();

	const onChooseImage = (e) => {
		// uploadImageToCloudinary(e.target.files[0]).then((result) => {
		// 	result && console.log(result.url);
		// 	setImageUrl(result.url);
		// });
		uploadImageToServer(e.target.files[0]).then((result) => {
			const pat1 = result.file.path.replace("\\", "/");

			const newImageUrl = `${process.env.REACT_APP_API_BASE_URL}/${pat1}`;

			setImageUrl(newImageUrl);
		});
	};

	const onClickAdd = () => {
		if (category === "carousel") {
			addImage(imageUrl).then((result) => {
				if (result.status) {
					toast({
						title: "Error!",
						description: "Somethings went wrong.",
						status: "error",
						duration: 2000,
						isClosable: true,
					});
				} else {
					onClose(true);
					setRefresh(!refresh);
					toast({
						title: "Added!",
						description: "Image successfully added.",
						status: "success",
						duration: 2000,
						isClosable: true,
					});
				}
			});
		} else {
			addMiniImage(imageUrl).then((result) => {
				if (result.status) {
					onClose(true);
					toast({
						title: "Error!",
						description: "Somethings went wrong.",
						status: "error",
						duration: 2000,
						isClosable: true,
					});
				} else {
					onClose(true);
					setRefresh(!refresh);
					toast({
						title: "Added!",
						description: "Image successfully added.",
						status: "success",
						duration: 2000,
						isClosable: true,
					});
				}
			});
		}
	};

	return (
		<Modal onClose={onClose} isOpen={isOpen} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontSize={30} color="facebook.500">
					Add Image
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Select
						onChange={(e) => setCategory(e.target.value)}
						value={category}
					>
						<option value="carousel">Carousel</option>
						<option value="mini">Mini</option>
					</Select>
					<Input
						border="none"
						p={0}
						mt={3}
						type="file"
						onChange={onChooseImage}
					/>
				</ModalBody>
				<ModalFooter>
					<Button mx={3} px={7} colorScheme="facebook" onClick={onClickAdd}>
						Add
					</Button>
					<Button colorScheme="facebook" variant="outline" onClick={onClose}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AddImageModal;
