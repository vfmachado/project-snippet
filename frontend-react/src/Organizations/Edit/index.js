import React, { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import { FaBuilding } from "react-icons/fa";
import ReactLoading from "react-loading";

// Context
import { useOrganizations } from "../../../../contexts/Organizations/useOrganizations";

// Components
import SelectFormik from "../../../../components/SelectFormik";
import InputFormik from "../../../../components/InputFormik";
import InputMaskFormik from "../../../../components/InputMaskFormik";

// Validation
import { ValidationSchemaOrganization } from "../ValidationSchema";

const OrganizationsEdit = () => {
  const { id } = useParams();

  const {
    loaderOrganizations,
    loaderStoreOrganizations,
    organization,
    getOrganization,
    updateOrganization,
  } = useOrganizations();

  const initialValues = {
    cnpj: organization.cnpj,
    companyName: organization.companyName,
    commertialName: organization.commertialName,
    segmentType: organization.segmentType,
    postalCode: organization.postalCode,
    country: organization.country,
    state: organization.state,
    city: organization.city,
    neighborhood: organization.neighborhood,
    address: organization.address,
    number: organization.number,
    complement: organization.complement,
    isActive: organization.isActive,
  };

  // ADD NEW USER
  const handleUpdateOrganization = useCallback(
    async (values) => {
      await updateOrganization(id, values);
    },
    [id, updateOrganization]
  );

  useEffect(() => {
    getOrganization(id);
  }, [getOrganization, id]);

  return (
    <>
      {loaderOrganizations ? (
        <div>
          <ReactLoading
            className="m-auto"
            type="cylon"
            color="#6b6af7"
            height={48}
            width={52}
          />
        </div>
      ) : (
        <div className="card mb-3 shadow-sm">
          <div className="card-header">
            {" "}
            <FaBuilding /> Editar credor {organization.companyName}
          </div>
          <div className="card-body shadow-sm">
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={ValidationSchemaOrganization}
              onSubmit={handleUpdateOrganization}
            >
              {(props) => (
                <Form>
                  <div className="row">
                    <div className="col-lg-3 mb-4">
                      <label
                        htmlFor="isActive"
                        className="fs-6 fw-lighter mb-1"
                      >
                        <small>STATUS</small>
                      </label>
                      <div className="input-group">
                        <SelectFormik
                          props={props}
                          fieldName="isActive"
                          defaultValue={{
                            id: organization.isActive,
                            description: organization.isActive
                              ? "ATIVADO"
                              : "DESATIVADO",
                          }}
                          placeholder="Selecione um status"
                          getOptionLabel={(option) => option.description}
                          getOptionValue={(option) => option.id}
                          options={[
                            { id: false, description: "DESATIVADO" },
                            { id: true, description: "ATIVADO" },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 row">
                      <div className="col-lg-3 mb-4">
                        <label htmlFor="cnpj" className="fs-6 fw-lighter mb-1">
                          <small>CNPJ</small>
                        </label>
                        <InputMaskFormik
                          props={props}
                          value={props.values["cnpj"]}
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
                        <label
                          htmlFor="country"
                          className="fs-6 fw-lighter mb-1"
                        >
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
                          value={props.values["postalCode"]}
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
                          value={props.values["state"]}
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
                        <label
                          htmlFor="address"
                          className="fs-6 fw-lighter mb-1"
                        >
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
                        <label
                          htmlFor="number"
                          className="fs-6 fw-lighter mb-1"
                        >
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
                      Atualizar
                    </button>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default OrganizationsEdit;
