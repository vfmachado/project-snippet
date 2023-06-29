import React, { useEffect, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import { FaUserTimes } from "react-icons/fa";
import ReactLoading from "react-loading";

// Components
import MuiDatatableCustom from "../../../../components/MuiDatatable";
import SelectFormik from "../../../../components/SelectFormik";
import ModalCustom from "../../../../components/Modal";

// Context
import { useOrganizations } from "../../../../contexts/Organizations/useOrganizations";
import { useUsersBackoffice } from "../../../../contexts/UsersBackoffice/useUsersBackoffice";

const OrganizationsManageUsers = () => {
  const { state } = useLocation();
  const { organization } = state;

  const {
    loaderOrganizations,
    loaderStoreOrganizations,
    errorOrganizations,
    listOrganizationUsers,
    getOrganizationUsers,
    addUserToOrganization,
    removeUserToOrganization,
  } = useOrganizations();
  const { loaderUsers, listUsers, getAllUsers } = useUsersBackoffice();

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [modalUserValues, setModalUserValues] = useState({});

  // MODAL
  const handleCloseModal = () => {
    setModalUserValues({});
    setShowModalDelete(false);
  };
  const handleShowModal = (values) => {
    setModalUserValues(values);
    setShowModalDelete(true);
  };

  const [userIdsValid, setUserIdsValid] = useState(false);
  const initialValues = {
    userIds: null,
  };

  // TABLE COLUMNS
  const columns = [
    {
      name: "email",
      label: "E-mail",
      options: {
        filter: true,
      },
    },
    {
      name: "name",
      label: "Nome",
      options: {
        filter: true,
      },
    },
    {
      name: "lastname",
      label: "Sobrenome",
      options: {
        filter: true,
      },
    },
    {
      name: "isActive",
      label: "Status",
      options: {
        customBodyRender: (value, tableMeta) => (
          <p className="text-secondary">
            {value ? (
              <span className="badge bg-success-quitei">Ativo</span>
            ) : (
              <span className="badge bg-secondary">Desativado</span>
            )}
          </p>
        ),
      },
    },
    {
      name: "id",
      label: "Ações",
      options: {
        customBodyRender: (value, tableMeta) => (
          <div className="m-auto">
            <button
              className="btn text-danger"
              onClick={() =>
                handleShowModal({
                  id: value,
                  name: tableMeta.rowData[1],
                  lastname: tableMeta.rowData[2],
                  email: tableMeta.rowData[0],
                })
              }
            >
              <small className="fw-bold">
                <FaUserTimes /> REMOVER
              </small>
            </button>
          </div>
        ),
      },
    },
  ];

  const handleAddUser = useCallback(
    async (values, actions) => {
      setUserIdsValid(false);
      if (values.userIds.length <= 0) {
        return setUserIdsValid(true);
      }
      actions.resetForm();
      await addUserToOrganization(organization?.id, values.userIds);
      await getOrganizationUsers(organization?.id);
    },
    [addUserToOrganization, getOrganizationUsers, organization?.id]
  );

  // REMOVE USER
  const handleRemoveUser = useCallback(async () => {
    handleCloseModal();
    await removeUserToOrganization(organization?.id, modalUserValues?.id);
    await getOrganizationUsers(organization?.id);
    getAllUsers();
  }, [
    getAllUsers,
    getOrganizationUsers,
    modalUserValues?.id,
    organization?.id,
    removeUserToOrganization,
  ]);

  useEffect(() => {
    getOrganizationUsers(organization?.id);
    getAllUsers();
  }, [getOrganizationUsers, organization?.id, getAllUsers]);

  return (
    <>
      <div className="row">
        <div className="col-lg-12 mb-4">
          <div className="card mb-3 shadow-sm">
            <div className="card-header">
              Gerenciar usuários de {organization?.name}
            </div>
            <div className="card-body shadow-sm">
              <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleAddUser}
              >
                {(props) => (
                  <Form>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="bg-light p-3 rounded">
                          <label
                            htmlFor="userIds"
                            className="fs-6 fw-lighter mb-1"
                          >
                            <small>Usuários</small>
                          </label>

                          <div className="input-group has-validation">
                            <SelectFormik
                              isSearchable
                              props={props}
                              fieldName="userIds"
                              isLoading={loaderUsers}
                              isMulti
                              placeholder="Selecione uma opção"
                              getOptionLabel={(option) => option.name}
                              getOptionValue={(option) => option.id}
                              options={listUsers}
                              isInvalid={userIdsValid}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {loaderStoreOrganizations ? (
                      <ReactLoading
                        className="m-auto"
                        type="cylon"
                        color="#6b6af7"
                        height={48}
                        width={52}
                      />
                    ) : (
                      <button
                        type="submit"
                        className="btn bg-purple text-white mt-4 px-4"
                        disabled={!props.values["userIds"]}
                      >
                        Adicionar
                      </button>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>

        <div className="col-lg-12 mb-4">
          <MuiDatatableCustom
            title={`Lista de usuários de ${organization?.name}`}
            columns={columns}
            values={listOrganizationUsers}
            loader={loaderOrganizations}
            error={errorOrganizations}
            pagination={false}
          />
        </div>
      </div>

      <ModalCustom
        showModal={showModalDelete}
        handleCloseModal={handleCloseModal}
        titleHeader="Tem certeza que deseja remover este usuário?"
        colorTitleHeader="text-danger"
        bodyValue={
          <p className="fw-bold text-secondary text-center">
            Nome: {modalUserValues?.name} {modalUserValues?.lastname} <br />
            E-mail: {modalUserValues?.email}
          </p>
        }
        footerValue={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Não
            </button>
            <button className="btn btn-danger" onClick={handleRemoveUser}>
              Sim, remover
            </button>
          </>
        }
      />
    </>
  );
};

export default OrganizationsManageUsers;
