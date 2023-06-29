import React, { createContext, useCallback, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";

import { OrganizationsPath } from "../../routes/Config";

const OrganizationsContext = createContext();

const OrganizationsProvider = ({ children }) => {
  const history = useHistory();

  // GET ORGANIZATIONS = GET ONE ORGANIZATION
  const [loaderOrganizations, setLoaderOrganizations] = useState(true);
  const [errorOrganizations, setErrorOrganizations] = useState(false);
  const [listOrganizations, setListOrganizations] = useState([]);
  const [organization, setOrganization] = useState({});
  const [policy, setPolicy] = useState({});
  const [listOrganizationUsers, setListOrganizationUsers] = useState([]);
  const [listOrganizationPolicies, setListOrganizationPolicies] = useState([]);

  // ADD ORGANIZATION
  const [loaderStoreOrganizations, setLoaderStoreOrganizations] =
    useState(false);

  // ----------------------------//
  // --------FUNCTIONS-----------//
  // ----------------------------//

  // GET ALL ORGANIZATIONS
  const getAllOrganizations = useCallback(async () => {
    try {
      setErrorOrganizations(false);
      setLoaderOrganizations(true);
      const response = await api.get("/v1/organizations");
      setListOrganizations(response.data.data);
      setLoaderOrganizations(false);
    } catch (error) {
      setErrorOrganizations(true);
      setLoaderOrganizations(false);
    }
  }, []);

  // GET ONE ORGANIZATION
  const getOrganization = useCallback(async (id) => {
    try {
      setErrorOrganizations(false);
      setLoaderOrganizations(true);
      const response = await api.get(`/v1/organizations/${id}`);
      setOrganization(response.data);
      setLoaderOrganizations(false);
    } catch (error) {
      setErrorOrganizations(true);
      setLoaderOrganizations(false);
    }
  }, []);

  // GET ORGANIZATION USERS
  const getOrganizationUsers = useCallback(async (id) => {
    try {
      setErrorOrganizations(false);
      setLoaderOrganizations(true);
      const response = await api.get(`/v1/organizations/${id}/users`);
      setListOrganizationUsers(response.data);
      setLoaderOrganizations(false);
    } catch (error) {
      setErrorOrganizations(true);
      setLoaderOrganizations(false);
    }
  }, []);

  // ADD USER TO ORGANIZATION
  const addUserToOrganization = useCallback(async (organizationId, userIds) => {
    try {
      setLoaderStoreOrganizations(true);
      await api.post("/v1/organizations/associate", {
        organizationId,
        userIds,
      });
      setLoaderStoreOrganizations(false);
      toast.success("Usuário adicionado com sucesso!");
    } catch (error) {
      console.log("error", error.response.data);
      setLoaderStoreOrganizations(false);
      toast.error("Erro ao adicionar usuário");
    }
  }, []);

  // REMOVE USER TO ORGANIZATION
  const removeUserToOrganization = useCallback(
    async (organizationId, userId) => {
      try {
        setLoaderOrganizations(true);
        await api.post("/v1/organizations/unassociate", {
          organizationId,
          userId,
        });
        setLoaderOrganizations(false);
        toast.success("Usuário removido com sucesso!");
      } catch (error) {
        console.log("error", error.response.data);
        setLoaderOrganizations(false);
        toast.error("Erro ao remover usuário");
      }
    },
    []
  );

  // GET ORGANIZATION POLICIES
  const getOrganizationPolicies = useCallback(async (id) => {
    try {
      setErrorOrganizations(false);
      setLoaderOrganizations(true);
      const response = await api.get(`/v1/organizations/${id}/rate-policies`);
      setListOrganizationPolicies(response.data);
      setLoaderOrganizations(false);
    } catch (error) {
      setErrorOrganizations(true);
      setLoaderOrganizations(false);
    }
  }, []);

  // GET ONE ORGANIZATION POLICY
  const getOneOrganizationPolicy = useCallback(
    async (organizationId, policyId) => {
      try {
        setErrorOrganizations(false);
        setLoaderOrganizations(true);
        const response = await api.get(
          `/v1/organizations/${organizationId}/rate-policies/${policyId}`
        );
        setPolicy(response.data);
        setLoaderOrganizations(false);
      } catch (error) {
        setErrorOrganizations(true);
        setLoaderOrganizations(false);
      }
    },
    []
  );

  // ADD POLICY TO ORGANIZATION
  const addPolicyToOrganization = useCallback(
    async (organizationId, values) => {
      try {
        setLoaderStoreOrganizations(true);
        await api.post(`/v1/organizations/${organizationId}/rate-policies`, {
          description: values.description,
          interestRate: Number.parseFloat(values.interestRate),
          interestType: values.interestType,
          interestMonthly: Number.parseFloat(values.interestMonthly),
          feeRate: Number.parseFloat(values.feeRate),
          debtAgeStart: Number.parseFloat(values.debtAgeStart),
          debtAgeEnd: Number.parseFloat(
            values.debtAgeEnd.length > 0 ? values.debtAgeEnd : "-1"
          ),
          isActive: true,
        });
        setLoaderStoreOrganizations(false);
        toast.success("Taxa adicionada com sucesso!");
      } catch (error) {
        console.log("error", error.response.data);
        setLoaderStoreOrganizations(false);
        toast.error("Erro ao adicionar taxa");
      }
    },
    []
  );

  // UPDATE POLICY
  const updatePolicy = useCallback(
    async (organizationId, policyId, values) => {
      try {
        setLoaderStoreOrganizations(true);
        await api.patch(
          `/v1/organizations/${organizationId}/rate-policies/${policyId}`,
          {
            description: values.description,
            interestRate: Number.parseFloat(values.interestRate),
            interestType: values.interestType,
            interestMonthly: Number.parseFloat(values.interestMonthly),
            feeRate: Number.parseFloat(values.feeRate),
            debtAgeStart: Number.parseFloat(values.debtAgeStart),
            debtAgeEnd: Number.parseFloat(
              values.debtAgeEnd.toString().length > 0 ? values.debtAgeEnd : "-1"
            ),
            isActive: values.isActive,
          }
        );
        setLoaderStoreOrganizations(false);
        toast.success("Taxa atualizada com sucesso!");
        return history.goBack();
      } catch (error) {
        console.log("error", error.response.data);
        setLoaderStoreOrganizations(false);
        toast.error("Erro ao atualizar taxa");
      }
    },
    [history]
  );

  // ADD ORGANIZATION
  const addOrganization = useCallback(
    async (values) => {
      try {
        setLoaderStoreOrganizations(true);
        const response = await api.post("/v1/organizations", {
          cnpj: values.cnpj,
          companyName: values.companyName,
          commertialName: values.commertialName,
          segmentType: values.segmentType,
          postalCode: values.postalCode,
          country: values.country,
          state: values.state,
          city: values.city,
          neighborhood: values.neighborhood,
          address: values.address,
          number: values.number,
          complement: values.complement,
        });

        const organizationId = response.data?.id;

        if (values.userIds.length > 0) {
          await addUserToOrganization(organizationId, values.userIds);
        }

        setLoaderStoreOrganizations(false);
        toast.success("Cadastro realizado com sucesso!");
        return history.push(`/${OrganizationsPath}/`);
      } catch (error) {
        console.log("error", error.response.data);
        setLoaderStoreOrganizations(false);
        toast.error("Erro ao cadastrar credor");
      }
    },
    [addUserToOrganization, history]
  );

  // UPDATE ORGANIZATION
  const updateOrganization = useCallback(
    async (id, values) => {
      try {
        setLoaderStoreOrganizations(true);
        await api.patch(`/v1/organizations/${id}`, {
          cnpj: values.cnpj,
          companyName: values.companyName,
          commertialName: values.commertialName,
          segmentType: values.segmentType,
          postalCode: values.postalCode,
          country: values.country,
          state: values.state,
          city: values.city,
          neighborhood: values.neighborhood,
          address: values.address,
          number: values.number,
          complement: values.complement,
          isActive: values.isActive,
        });
        setLoaderStoreOrganizations(false);
        toast.success("Alterações realizadas com sucesso!");
        return history.push(`/${OrganizationsPath}/`);
      } catch (error) {
        console.log("error", error.response);
        setLoaderStoreOrganizations(false);
        toast.error("Erro ao atualizar credor");
      }
    },
    [history]
  );

  return (
    <OrganizationsContext.Provider
      value={{
        loaderOrganizations,
        errorOrganizations,
        listOrganizations,
        organization,
        loaderStoreOrganizations,
        listOrganizationUsers,
        listOrganizationPolicies,
        policy,
        getAllOrganizations,
        getOrganization,
        addOrganization,
        updateOrganization,
        getOrganizationUsers,
        addUserToOrganization,
        removeUserToOrganization,
        getOrganizationPolicies,
        getOneOrganizationPolicy,
        addPolicyToOrganization,
        updatePolicy,
      }}
    >
      {children}
    </OrganizationsContext.Provider>
  );
};

function useOrganizations() {
  const context = useContext(OrganizationsContext);
  return context;
}

export { OrganizationsProvider, useOrganizations };
