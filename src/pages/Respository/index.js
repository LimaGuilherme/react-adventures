import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from "../../services/api";

import Container from "../../components/container";
import { Loading, Owner, IssueList } from './styles';
import { Link } from "react-router-dom";


export default class Repository extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repository: PropTypes.string,
            }),
        }).isRequired,
    };

    state = {
        repository: {},
        issues: [],
        loading: true,
    };

    async componentDidMount () {
        const { match } = this.props;

        const repositoryName = decodeURIComponent(match.params.repository);

        const [repositoryInfos, repositoryIssues] = await Promise.all([
            api.get(`/repos/${repositoryName}`),
            api.get(`/repos/${repositoryName}/issues`, {
                params: {
                    state: 'open',
                    per_page: 5,
                }
            })
        ]);

        this.setState({
              repository: repositoryInfos.data,
              issues: repositoryIssues.data,
              loading: false
          }
        )
    }
    render() {
        const { repository, issues, loading } = this.state;
        if (loading) {
            return <Loading>Carregando...</Loading>
        }
        return (
          <Container>
              <Owner>
                  <Link to="/"> Voltar aos repositórios </Link>
                  <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
                  <h1>{repository.name}</h1>
                  <p>{repository.description}</p>
              </Owner>
              <IssueList>
                  {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                  ))}
              </IssueList>
          </Container>
        );
    }
}