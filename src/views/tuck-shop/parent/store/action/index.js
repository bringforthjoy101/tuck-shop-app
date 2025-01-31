import { paginateArray, sortCompare, apiRequest, swal } from "@utils";

// ** Get all Admin
export const getAllData = () => {
	return async (dispatch) => {
		const response = await apiRequest({ url: "/parents", method: "GET" }, dispatch);
		console.log(response);
		if (response) {
			if (response.data.data && response.data.status) {
				await dispatch({
					type: "GET_ALL_PARENT_DATA",
					data: response.data.data,
				});
			} else {
				console.log(response.error);
			}
		} else {
			swal("Oops!", "Somthing went wrong with your network.", "error");
		}
	};
};

// ** Get filtered admins on page or row change
export const getFilteredData = (parents, params) => {
	return async (dispatch) => {
		const { q = "", perPage = 10, page = 1, status = null } = params;

		/* eslint-disable  */
		const queryLowered = q.toLowerCase();
		const filteredData = parents.filter(
			(parent) =>
				(parent.phone.toLowerCase().includes(queryLowered) ||
					parent.fullName.toLowerCase().includes(queryLowered)) &&
				parent.status === (status || parent.status),
		);
		/* eslint-enable  */

		dispatch({
			type: "GET_FILTERED_PARENT_DATA",
			data: paginateArray(filteredData, perPage, page),
			totalPages: filteredData.length,
			params,
		});
	};
};

// get Admin Details
export const getParent = (id) => {
	return async (dispatch) => {
		const response = await apiRequest({ url: `/parents/${id}`, method: "GET" }, dispatch);
		if (response) {
			if (response.data.data && response.data.status) {
				await dispatch({
					type: "GET_PARENT",
					selectedParent: response.data.data,
				});
			} else {
				console.log(response.error);
			}
		} else {
			swal("Oops!", "Somthing went wrong with your network.", "error");
		}
	};
};


// activate admin account
export const activateParent = (parents, id) => {
	const parent = parents.find((i) => i.parent_id === id);
	return async (dispatch) => {
		const response = await apiRequest({ url: `/parent/activate/${parent.parent_id}`, method: "GET" }, dispatch);
		if (response) {
			if (response.data.success) {
				dispatch({
					type: "GET_PARENT",
					selectedParent: { ...parent, status: "Active" },
				});
				swal("Good!", `${response.data.message}.`, "success");
				await dispatch(getAllData());
			} else {
				swal("Oops!", `${response.data.message}.`, "error");
			}
		} else {
			swal("Oops!", "Something went wrong with your network.", "error");
		}
	};
};

// deactivate admin account
export const deactivateParent = (parents, id) => {
	const parent = parents.find((i) => i.parent_id === id);
	return async (dispatch) => {
		const response = await apiRequest({ url: `/parent/deactivate/${parent.parent_id}`, method: "GET" }, dispatch);
		if (response) {
			if (response.data.success) {
				dispatch({
					type: "GET_PARENT",
					selectedParent: { ...parent, status: "Inactive" },
				});
				swal("Good!", `${response.data.message}.`, "success");
				await dispatch(getAllData());
			} else {
				swal("Oops!", `${response.data.message}.`, "error");
			}
		} else {
			swal("Oops!", "Something went wrong with your network.", "error");
		}
	};
};

// Change admin role
export const editParent = (parentId, parentData) => {
	return async (dispatch) => {
		const body = JSON.stringify(parentData);
		const response = await apiRequest({ url: `/parents/update/${parentId}`, method: "POST", body }, dispatch);
		if (response) {
			if (response.data.status) {
				swal("Good!", `${response.data.message}.`, "success");
				dispatch(getAllData());
			} else {
				swal("Oops!", `${response.data.message}.`, "error");
			}
		} else {
			console.log(response);
			swal("Oops!", "Somthing went wrong with your network.", "error");
		}
	};
};

export const deleteParent = (id) => {
	return async (dispatch) => {
		const response = await apiRequest({ url: `/parents/delete/${id}`, method: "GET" }, dispatch);
		if (response && response.data.status) {
			return response.data;
		} else {
			console.log(response);
			swal("Oops!", "Something went wrong.", "error");
		}
	};
};
