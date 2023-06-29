import React, { useEffect, useCallback } from "react";
import { Formik, Form } from "formik";
import { FaBuilding } from "react-icons/fa";
import ReactLoading from "react-loading";

// components
import InputMaskFormik from "../../../../components/InputMaskFormik";
import InputFormik from "../../../../components/InputFormik";
import SelectFormik from "../../../../components/SelectFormik";

// Context
import { useOrganizations } from "../../../../contexts/Organizations/useOrganizations";
import { useUsersBackoffice } from "../../../../contexts/UsersBackoffice/useUsersBackoffice";

// Validation
import { ValidationSchemaOrganization } from "../ValidationSchema";

const OrganizationsAdd = () => {
  const { loaderStoreOrganizations, addOrganization } = useOrganizations();
  const { loaderUsers, listUsers, getAllUsers } = useUsersBackoffice();

  const initialValues = {
    cnpj: "",
    companyName: "",
    commertialName: "",
    segmentType: "",
    postalCode: "",
    country: "",
    state: "",
    city: "",
    neighborhood: "",
    address: "",
    number: "",
    complement: "",
    userIds: [],
  };

  // ADD NEW USER
  const handleAddOrganization = useCallback(
    async (values) => {
      await addOrganization(values);
    },
    [addOrganization]
  );

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <>
      <div className="card mb-3 shadow-sm">
        <div className="card-header">
          <FaBuilding /> Adicionar novo Credor
        </div>
        <div className="card-body shadow-sm">
          <Formik
            initialValues={initialValues}
            validationSchema={ValidationSchemaOrganization}
            onSubmit={handleAddOrganization}
          >
            {(props) => (
              <Form>
                <div className="row">
                  <div className="col-lg-12 row">
                    <div className="col-lg-3 mb-4">
                      <label htmlFor="cnpj" className="fs-6 fw-lighter mb-1">
                        <small>CNPJ</small>
                      </label>
                      <InputMaskFormik
                        props={props}
                        fieldName="cnpj"
                        mask="99999999999999"
                        placeholder="Digite seu CNPJ"
                      />
                    </div>

                    <div className="col-lg-3 mb-4">
                      <label
                        htmlFor="companyName"
                        className="fs-6 fw-lighter mb-1"
                      >
                        <small>Nome do credor</small>
                      </label>
                      <InputFormik
                        props={props}
                        type="text"
                        fieldName="companyName"
                        placeholder="Digite o nome do credor"
                      />
                    </div>

                    <div className="col-lg-3 mb-4">
                      <label
                        htmlFor="commertialName"
                        className="fs-6 fw-lighter mb-1"
                      >
                        <small>Nome comercial</small>
                      </label>
                      <InputFormik
                        props={props}
                        type="text"
                        fieldName="commertialName"
                        placeholder="Digite o nome comercial"
                      />
                    </div>

                    <div className="col-lg-3 mb-4">
                      <label
                        htmlFor="segmentType"
                        className="fs-6 fw-lighter mb-1"
                      >
                        <small>Tipo</small>
                      </label>
                      <InputFormik
                        props={props}
                        type="text"
                        fieldName="segmentType"
                        placeholder="Digite o tipo"
                      />
                    </div>

                    <div className="col-lg-2 mb-4">
                      <label htmlFor="country" className="fs-6 fw-lighter mb-1">
                        <small>País</small>
                      </label>
                      <InputFormik
                        props={props}
                        type="text"
                        fieldName="country"
                        placeholder="Digite o País"
                      />
                    </div>

                    <div className="col-lg-2 mb-4">
                      <label
                        htmlFor="postalCode"
                        className="fs-6 fw-lighter mb-1"
                      >
                        <small>CEP</small>
                      </label>
                      <InputMaskFormik
                        props={props}
                        fieldName="postalCode"
                        mask="99999999"
                        placeholder="Digite seu CEP"
                      />
                    </div>

                    <div className="col-lg-2 mb-4">
                      <label htmlFor="state" className="fs-6 fw-lighter mb-1">
                        <small>Estado</small>
                      </label>
                      <InputMaskFormik
                        props={props}
                        fieldName="state"
                        uppercase
                        mask="aa"
                        placeholder="Ex: SP"
                      />
                    </div>

                    <div className="col-lg-3 mb-4">
                      <label htmlFor="city" className="fs-6 fw-lighter mb-1">
                        <small>Cidade</small>
                      </label>
                      <InputFormik
                        props={props}
                        type="text"
                        fieldName="city"
                        placeholder="Digite a cidade"
                      />
                    </div>

                    <div className="col-lg-3 mb-4">
                      <label
                        htmlFor="neighborhood"
                        className="fs-6 fw-lighter mb-1"
                      >
                        <small>Bairro</small>
                      </label>
                      <InputFormik
                        props={props}
                        type="text"
                        fieldName="neighborhood"
                        placeholder="Digite o bairro"
                      />
                    </div>

                    <div className="col-lg-5 mb-4">
                      <label htmlFor="address" className="fs-6 fw-lighter mb-1">
                        <small>Endereço</small>
                      </label>
                      <InputFormik
                        props={props}
                        type="text"
                        fieldName="address"
                        placeholder="Digite o endereço"
                      />
                    </div>

                    <div className="col-lg-2 mb-4">
                      <label htmlFor="number" className="fs-6 fw-lighter mb-1">
                        <small>Número</small>
                      </label>
                      <InputFormik
                        props={props}
                        type="text"
                        fieldName="number"
                        placeholder="Digite o número"
                      />
                    </div>

                    <div className="col-lg-5 mb-4">
                      <label
                        htmlFor="complement"
                        className="fs-6 fw-lighter mb-1"
                      >
                        <small>Complemento</small>
                      </label>
                      <InputFormik
                        props={props}
                        type="text"
                        fieldName="complement"
                        placeholder="Digite o complemento"
                      />
                    </div>
                  </div>

                  <div className="col-lg-5">
                    <div className="bg-light p-3 rounded">
                      <label
                        htmlFor="rolesIds"
                        className="fs-6 fw-lighter mb-1"
                      >
                        <small>Relacionar usuários a este credor?</small>
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
                  >
                    Cadastrar
                  </button>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default OrganizationsAdd;
