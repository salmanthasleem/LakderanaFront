
const helpsAutoFill = (formik) => ({
    name: formik.touched.name && formik.errors.name,
    id: formik.touched.id && formik.errors.id,
})

const errsAutoFill = (formik) => ({
    name: formik.touched.name && Boolean(formik.errors.name),
    id: formik.touched.id && Boolean(formik.errors.id),
})

const onChangesAutoFill = (formik, values) => ({
    name: () => formik.setFieldValue('name', values.cusName),
    id: () => formik.setFieldValue('id', values.cusId)
})

const helps = (formik) => ({
    name: formik.touched.name && formik.errors.name,
    mobile: formik.touched.mobile && formik.errors.mobile,
    identity: formik.touched.identity && formik.errors.identity,
})

const errs = (formik) => ({
    name: formik.touched.name && Boolean(formik.errors.name),
    mobile: formik.touched.mobile && Boolean(formik.errors.mobile),
    identity: formik.touched.identity && Boolean(formik.errors.identity),
})

const vals = (formik) => ({
    name: formik.values.name,
    mobile: formik.values.mobile,
    identity: formik.values.identity
})

export { helps, helpsAutoFill, errs, errsAutoFill, onChangesAutoFill, vals }