import Swal from "sweetalert2";

export const handleDelete = async ({
  dispatch,
  id,
  action,
  title = "Delete Item?",
  text = "Are you sure you want to delete this item?",
  successText = "Deleted successfully",
}) => {

  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  // 💜 Purple Loader
  Swal.fire({
    title: "Deleting...",
    text: "Please wait",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();

      const loader = Swal.getLoader();

      if (loader) {
        loader.style.borderColor = "#9333ea transparent #9333ea transparent";
      }
    },
  });

  try {

    await dispatch(action(id)).unwrap();

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: successText,
      confirmButtonColor: "#9333ea",
      timer: 1500,
    });

  } catch (error) {

    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error?.message || "Delete failed",
      confirmButtonColor: "#9333ea",
    });
  }
};


export const handleReject = async ({
  dispatch,
  id,
  reason,
  action,
  title = "Reject Item?",
  text = "Are you sure you want to reject this?",
  successText = "Rejected successfully ❌",
  afterSuccess,
}) => {
  if (!reason?.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Required",
      text: "Please provide a rejection reason",
      confirmButtonColor: "#9333ea",
    });
    return;
  }

  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#9333ea",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Reject",
  });

  if (!result.isConfirmed) return;

  Swal.fire({
    title: "Rejecting...",
    text: "Please wait",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();

      const popup = Swal.getPopup();
      if (popup) {
        popup.style.borderTop = "4px solid #9333ea";
      }
    },
  });

  try {
    await dispatch( action({ id,reason, })
    ).unwrap();

    Swal.fire({
      icon: "success",
      title: "Success",
      text: successText,
      confirmButtonColor: "#9333ea",
      timer: 1500,
      showConfirmButton: false,
    });

    if (afterSuccess) afterSuccess();
  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error?.message ||
        error?.payload?.message ||
        "Reject failed. Try again.",
      confirmButtonColor: "#9333ea",
    });
  }
};


export const handleApprove = async ({
  dispatch,
  id,
  action,
  title = "Approve Item?",
  text = "Are you sure you want to approve this?",
  successText = "Approved successfully ✅",
  afterSuccess,
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#9333ea", 
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Approve",
  });

  if (!result.isConfirmed) return;

  Swal.fire({
    title: "Approving...",
    text: "Please wait",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();

      const popup = Swal.getPopup();
      if (popup) {
        popup.style.borderTop = "4px solid #9333ea";
      }
    },
  });

  try {
    await dispatch(action(id)).unwrap();

    Swal.fire({
      icon: "success",
      title: "Success",
      text: successText,
      confirmButtonColor: "#9333ea",
      timer: 1500,
      showConfirmButton: false,
    });

    if (afterSuccess) afterSuccess();
  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error?.message ||
        error?.payload?.message ||
        "Approval failed. Please try again.",
      confirmButtonColor: "#9333ea",
    });
  }
};